import React from 'react';
import ReactDOM from 'react-dom';

import MessagePanel from './components/messagepanel';  

import './pages.css';

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

        this.state.longpoll = true;
        
        this.longPoll = this.longPoll.bind(this);
        this.openChat = this.openChat.bind(this);
        this.notifications = this.notifications.bind(this);        
        
        this.state.msgInterval = null;
        this.state.connection = null;

        this.state.write = false;
    }

    componentDidMount(newLongPoll = true) {

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
            axios.post('/api/message/last')
                .then((e) => {
                    console.log(e.data);

                    if(e.data.length == 0)
                    {
                        this.longPoll('000000000000000000000000');
                    }
                })
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
                <div  key={'key' + data._id} className="member-list-item" title="Это же я!" me="me"><strong id="me">@</strong><span>{data.name}</span></div>
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


    }

    send() {

        if(this.state.currentChat == '')
            return;

        let msgBox = document.getElementById('msg');
        if(!msgBox)
            return;

        let msg = msgBox.value;
        if(help.isEmptyOrSpaces(msg))
            return;

        let data = {};

        data.msg = msg;
        data.cid = this.state.currentChat;

        msgBox.value = '';

        if(!this.state.currentExist)
        {
            axios.post('/api/message/whisper',data)
                .then((e) => {
                    msgBox.value = '';
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

    longPoll(id) {
        axios.post('/api/message/updates',{
            id : id
        }, {
            cancelToken : new CancelToken((c) =>{
                colseLongPoll = c;
            })
        }).then((e) => {
            console.log(e.data);
            let newMsgsEvent = e.data.find(e => e.type == 'msg');
           
            if(this.state.longpoll) {   

                if(newMsgsEvent) {
                    this.longPoll(newMsgsEvent.content[newMsgsEvent.content.length - 1]._id);
                }
                else {
                    this.longPoll(id);
                }
            }
            
            if(newMsgsEvent)
            {            
                this.setState({
                    msgs : newMsgsEvent.content.filter(e => e.cid == this.state.currentChat)
                });

                this.notifications(newMsgsEvent);
            }

        }).catch((e) => {
            console.log('longPollError');
            console.log(e);
        });
    }

    notifications(e) {
        try {
            
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

            console.log(s);
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

        if(!this.state.write && !help.isEmptyOrSpaces(input.value))
        {
            console.log('STARTWrite');
            this.state.write = true;
        }
        else if(help.isEmptyOrSpaces(input.value))
        {
            console.log('StopWrite');
            this.state.write = false;
        }
    }   

    focuseGotMonitor(e) {

        let input = document.getElementById('msg');

        if(!help.isEmptyOrSpaces(input.value))
        {
            console.log('STARTWrite');
            this.state.write = true;
        }
    }

    focuseLostMonitor(e) {

        if(this.state.write)
        {
            console.log('StopWrite');
            this.state.write = false;
        }
    }

    render() {
        return (
            <div className="big standart-back relative">
                <div className="chat-panel-loader delay" id="chatLoader">
                    <div className="loader"></div>
                </div>
                {this.chatPanel()}
                <div className="right-box relative">
                    <div className="message-panel-big" id="messagePanel">
                        <MessagePanel newMsg={this.state.msgs} me={this.state.me} members={this.state.chats.members} id={this.state.currentChat} exists={this.state.currentExist}/>
                    </div>
                    <div className="send-panel">
                        <div className="send-input relative">
                            <input 
                                onChange={(e) => this.textChangeMonitor(e)} 
                                onFocus={(e) => this.focuseGotMonitor(e)} 
                                onBlur={(e) => this.focuseLostMonitor(e)} 
                                onKeyUp={(e) => { if(e.key == 'Enter') this.send(); }}
                                id="msg" 
                                type="text" 
                                autoComplete="off" 
                                name="msgbox" 
                                placeholder="Сообщение..." />
                            <div className="emoji-button" id="emojiButton"></div>
                            <div onClick={((e) => {this.send()})} className="send-button" id="send">
                                <div className="send-image"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat;