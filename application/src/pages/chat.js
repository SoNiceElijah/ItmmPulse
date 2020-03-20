import React from 'react';
import ReactDOM from 'react-dom';

import MessagePanel from './components/messagepanel';  

import './pages.css';
import './pages_min.css';

const axios = require('axios');
const help = require('../utils/help');

const CancelToken = axios.CancelToken;
let colseLongPoll;

class Chat extends React.Component {
    
    constructor(prop)    {
        super(prop);

        this.state = {}

        this.state.chats = {}
        this.state.chats.chats = []
        this.state.chats.members = []

        this.state.currentChat = '';
        this.state.currentExist = '';
        this.state.msgs = [];

        this.state.emoji = [];

        this.state.longpoll = true;
        
        this.longPoll = this.longPoll.bind(this);
        this.openChat = this.openChat.bind(this);
        this.notifications = this.notifications.bind(this);  
        
        this.findUserByid = this.findUserByid.bind(this);
        this.findChatByid = this.findChatByid.bind(this);
        
        this.state.msgInterval = null;
        this.state.connection = null;

        this.state.write = false;
    }

    findUserByid(id) {

        let user = this.state.chats.members.find(e => e._id === id);

        if(!user)
        {
            this.componentDidMount(false);
        }

        return user;
    }

    findChatByid(id) {
        let chat = this.state.chats.chats.find(e => e._id === id);

        if(!chat)
        {
            this.componentDidMount(false);
        }

        return chat;
    }

    sendInputRemap() {

        let big = document.getElementById('superInputContainer');
        let container = document.getElementById('inputContainer');
        let elem = document.getElementById('fake_msg');

        container.style.height = elem.clientHeight + 5 + 'px';
        big.style.height = elem.clientHeight + 60 + 'px';

        let panel = document.getElementById('messagePanel');
        let superPanel = document.getElementById('rightBox');
        let scrollPanel = document.getElementById('messagePanel2');

        let adjust = document.getElementById('adjust');

        if(scrollPanel)
        {
           
            let scrollDif = scrollPanel.clientHeight;
            panel.style.height = (superPanel.clientHeight - big.clientHeight - adjust.clientHeight) + 'px';
            scrollPanel.scrollTop += scrollDif - scrollPanel.clientHeight;
        }
        else
        {
            panel.style.height = (superPanel.clientHeight - big.clientHeight - adjust.clientHeight) + 'px';
        }




    }

    componentDidMount(newLongPoll = true) {

        this.sendInputRemap();

        axios.post('/api/message/emoji')
            .then((e) => {
                this.state.emoji = e.data;
            });
        //Me and chats
        axios.post('/api/user/me')
            .then((e) => {
                this.state.me = e.data;

                axios.post('/api/team/info',{
                    id : this.state.me.team_ids[0]
                }).then((e) => {

                    this.setState({ chats : e.data });
                    console.log(this.state);

                    let loader = document.getElementById('chatLoader');
                    loader.classList.add('opacity-0');

                    setTimeout(() => {
                        loader.classList.add('display-none');
                    },200);

                }).catch((e) => {
                    console.log('WTF');
                    console.log(e);
                })
            })
            .catch((e) => {
                console.log('WTF');
                console.log(e);
            });


        if(newLongPoll) {
            console.log('Open longpoll');
            //Long polling
            this.longPoll(help.toUTC(new Date()));
        }
    }

    littleChat(data) {
        return (
            <div onClick={(e) => {this.openChat(data._id)}} key={'key' + data._id} className="chat-list-item" id={'cid' + data._id}><strong>#</strong><span>{data.name}</span><div id={'cidal' + data._id} className="new-message-alert template">0</div></div>
        );
    }

    littleMember(data) {
        if(data.me)
            return (
                <div  key={'key' + data._id} className="member-list-item" title="Это же я!" me="me"><strong id="me">@</strong><span id="me">{data.name}</span></div>
            );
        else if(data.exist)
            return (
                <div onClick={(e) => {this.openChat(data.direct)}}  key={'key' + data._id} id={'cid' + data.direct} exist="exist" className="member-list-item"><strong>@</strong><span>{data.name}</span><div id={'cidal' + data.direct} className="new-message-alert template">0</div></div>
            )
        else    
            return (
                <div onClick={(e) => {this.openChat(data._id, false)}} key={'key' + data._id} id={'cid' + data._id} className="member-list-item" ><strong>@</strong><span>{data.name}</span><div id={'cidal' + data._id} className="new-message-alert template">0</div></div>
            )
    }

    openChat(id, exist = true) {

        if(this.state.currentChat == id)
            return;

        let panel = document.getElementById('leftBigPanel');
        panel.classList.add('collapsed');
        panel = document.getElementById('rightBox');
        panel.style.zIndex = 8;

        let notifyDiv = document.getElementById('cidal' + id);

        if(notifyDiv.innerHTML != '0') {          
            window.clearInterval(this.state.msgInterval);
            document.title = 'Pulse';

            notifyDiv.innerHTML = '0';
            notifyDiv.classList.add('template');
        }       

        if(this.state.currentChat != '')
            document.getElementById('cid' + this.state.currentChat).removeAttribute('selected');

        document.getElementById('cid' + id).setAttribute('selected','selected');
        
        this.setState({
            currentChat : id,
            currentExist : exist
        });

        this.props.topBar("Назад? Не сегодня, сори");


    }

    send() {

        console.log('try send');

        if(this.state.currentChat == '')
            return;

        let msgBox = document.getElementById('msg');
        let fakeBox = document.getElementById('fake_msg');
        if(!msgBox)
            return;

        let msg = msgBox.value;
        if(help.isEmptyOrSpaces(msg))
            return;

        let data = {};

        data.msg = msg;
        data.cid = this.state.currentChat;
        data.random = Math.floor(Math.random() * 1000);

        fakeBox.innerHTML = '';
        this.textChangeMonitor({ target : fakeBox});

        if(!this.state.currentExist)
        {
            axios.post('/api/message/whisper',data)
                .then((e) => {
                    msgBox.value = '';
                    fakeBox.innerHTML = '';
                    this.componentDidMount(false);

                    this.setState({
                        currentChat : e.data.id,
                        currentExist : true
                    });
                })
                .catch((e) => {
                    console.log('WTF');
                    console.log(e);
                })
        }
        else
        {
            axios.post('/api/chat/writing',{
                id : data.cid,
                state : false
            });
            this.state.write = false;
            axios.post('/api/message/send',data)
                .then((e) => {
                    
                })
                .catch((e) => {
                    console.log('WTF');
                    console.log(e);
                })
        }
        
    }

    componentWillUnmount() {
        this.state.longpoll = false;

        if(colseLongPoll)
            colseLongPoll();
        console.log('unmount');
    }

    longPoll(ts) {
        console.log(`LongPollCalled with TS: ${ts}`);
        axios.post('/api/message/updates',{
            ts : ts
        }, {
            cancelToken : new CancelToken((c) =>{
                colseLongPoll = c;
            })
        }).then((e) => {
            console.log('LONG_POLL_DATA:');
            console.log(e.data);

            let newMsgsEvent = e.data.find(e => e.type == 'msg');
            let chatWriteEvent = e.data.find(e => e.type == 'write');
            let newTeamMembersEvent = e.data.find(e => e.type == 'new');
           
            if(this.state.longpoll) {   

                if(e.data.length == 1 && e.data[0].type == 'restart') {
                    console.log('LongPollRestarted');
                    this.longPoll(ts);
                }
                else {
                    console.log('LongPollUpdated');
                    let nums = e.data.map(el => el.ts);
                    this.longPoll(Math.max.apply(Math, nums));
                }
            }
            
            if(newMsgsEvent)
            {            
                this.setState({
                    msgs : newMsgsEvent.content.filter(e => e.cid == this.state.currentChat)
                });

                this.notifications(newMsgsEvent);
            }

            if(chatWriteEvent)
            {
                let currentChatWriters = chatWriteEvent.content.filter(e => e.cid == this.state.currentChat).map(e => e.members);
                currentChatWriters = currentChatWriters[currentChatWriters.length - 1];
                
                this.changeWriters(currentChatWriters);
            }
            if(newTeamMembersEvent)
            {
                this.componentDidMount(false);
            }

        }).catch((e) => {
            console.log('longPollError');
            console.log(e);
        });
    }

    changeWriters(writers) {

        writers = writers.filter(e => e != this.state.me._id);
        writers = writers.map(e => this.findUserByid(e)).map(e => e.name);
        let div = document.getElementById('writers');
        if(writers.length == 0)
        {         
            div.classList.add('opacity-0');
        }
        else
        {
            let str = writers.join(', ');
            if(str.length > 15)
                str = str.slice(0,15) + '...';

            this.setState({
                writers : str
            })
            div.classList.remove('opacity-0');
        }
    }

    notifications(e) {
        try {
            
            let cids = e.content.map(m => m.cid);
            let chats = cids.map(c => this.findChatByid(c));

            console.log('Do Notifications!');

            let s = {};
            for(let i = 0; i < e.content.length; ++i)
            {
                if(e.content[i].cid == this.state.currentChat)
                    continue;
                
                if(!s['cidal' + e.content[i].cid])
                    s['cidal' + e.content[i].cid] = 1;
                else
                    s['cidal' + e.content[i].cid]++;
            }
            let k = 0;
            for(let param in s)
            {
                let num = document.getElementById(param).innerHTML;
                document.getElementById(param).innerHTML = parseInt(num) + s[param];
                document.getElementById(param).classList.remove('template');
            
                k++;
            }

            if(k != 0)
            {
                let audio = new Audio('/effects/click.mp3');
                audio.play();
                
                let j = -1;
                let b = ['NEW','MESSAGE'];

                clearInterval(this.state.msgInterval);
                let iid = setInterval(() => {
                    j++;
                    j = j % 2;
                    document.title = b[j];
                },1000);

                this.setState({
                    msgInterval : iid
                })
            }


        }
        catch(v)
        {
            console.log(v);
        }
    }

    chatPanel() {
        return (
            <div className="chat-panel">
                <div className="chat-list">
                    <div className="chat-list-title">Chats</div>
                    <div className="chat-list-items">
                        {this.state.chats.chats.map(e => this.littleChat(e))}
                    </div>
                </div>
                <div className="member-list">
                    <div className="member-list-title">Members</div>
                    <div className="member-list-items">
                        {this.state.chats.members.map(e => this.littleMember(e))}
                    </div>
                </div>
            </div>
        );
    }

    textChangeMonitor(e) {

        let input = document.getElementById('msg');

        let text = e.target.innerText;
        text = text.replace(/<br>/gi,' ');
        text = text.replace(/&nbsp;/g,' ');
        input.value = text;

        this.sendInputRemap();

        if(this.state.currentChat == '' || !this.state.currentExist)
            return;

        if(!this.state.write && !help.isEmptyOrSpaces(input.value))
        {
            console.log('STARTWrite');
            axios.post('/api/chat/writing',{
                id : this.state.currentChat,
                state : true
            });
            this.state.write = true;
        }
        else if(help.isEmptyOrSpaces(input.value))
        {
            console.log('StopWrite');
            axios.post('/api/chat/writing',{
                id : this.state.currentChat,
                state : false
            });
            this.state.write = false;
        }
    }   

    focuseGotMonitor(e) {

        if(this.state.currentChat == '' || !this.state.currentExist)
            return;

        this.sendInputRemap();
        let input = document.getElementById('msg');

        if(!help.isEmptyOrSpaces(input.value))
        {
            console.log('STARTWrite');
            axios.post('/api/chat/writing',{
                id : this.state.currentChat,
                state : true
            });
            this.state.write = true;
        }
    }

    focuseLostMonitor(e) {

        if(this.state.currentChat == '' || !this.state.currentExist)
            return;

        this.sendInputRemap();
        if(this.state.write)
        {
            console.log('StopWrite');
            axios.post('/api/chat/writing',{
                id : this.state.currentChat,
                state : false
            });
            this.state.write = false;
        }
    }

    mapEmoji(m) {
        let path = "/emoji/svg/" + m;
        return (
            <img className="emoji-small" onClick={() => {this.pushEmoji(m)}} src={path}></img>
        )
    }

    pushEmoji(m) {
        let path = "/emoji/svg/" + m;
        let fake = document.getElementById('fake_msg');
        fake.innerHTML += `<div contenteditable="false" class="sensetive"><span class="fake-text">::${m};</span><img class="emoji-small-text" src="${path}" ></img></div>&nbsp;`;

        this.textChangeMonitor({target : document.getElementById('fake_msg')});
    }

    render() {
        return (
            <div className="big standart-back relative">
                <div className="chat-panel-loader delay" id="chatLoader">
                    <div className="loader"></div>
                </div>
                {this.chatPanel()}
                <div className="right-box relative" id="rightBox">
                    <div className="message-panel-big" id="messagePanel">
                        <MessagePanel newMsg={this.state.msgs} me={this.state.me} findUser={this.findUserByid} id={this.state.currentChat} exists={this.state.currentExist}/>
                        <div id="writers" className="message-panel-writers delay opacity-0"><b>{this.state.writers}</b> набирает сообщение... </div>
                        <div id="adjust" className="msg-j" />
                    </div>
                    <div className="send-panel" id="superInputContainer">
                        <div className="send-input relative" id="inputContainer">
                            <input 
                                id="msg" 
                                type="text" 
                                autoComplete="off" 
                                name="msgbox" 
                                placeholder="Сообщение..." />
                            <div
                            
                                data-text="Enter text here"
                            
                                onInput={(e) => this.textChangeMonitor(e)} 
                                onFocus={(e) => this.focuseGotMonitor(e)} 
                                onKeyUp={(e) => { if(e.key == 'Enter') this.send(); }}
                                onBlur={(e) => this.focuseLostMonitor(e)}

                                className="send-input-div"
                                contentEditable="true"
                                id="fake_msg" 
                                type="text" 
                                autoComplete="off" 
                             />
                            <div 
                                className="emoji-button" 
                                id="emojiButton"
                            >
                                <div className="emoji-image" ></div>
                                <div 
                                    id="emojiPanel" 
                                    className="emoji-panel delay t-delay"
                                 >
                                    {this.state.emoji.map(m => this.mapEmoji(m))}
                                </div>
                            </div>

                            <div onClick={((e) => {
                                this.textChangeMonitor({target : document.getElementById('fake_msg')});
                                this.send();
                                })} className="send-button" id="send">
                                <div className="send-image"></div>
                            </div>
                            <div className="attach-button" id="attach">
                                <div className="attach-image"></div>
                                <div className="attach-panel delay t-delay">
                                    <ul>
                                        <li>Post</li>
                                        <li>DickPic</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat;