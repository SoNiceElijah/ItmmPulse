import React from 'react';
import ReactDOM from 'react-dom';

import MessagePanel from './components/messagepanel';  

import './pages.css';

const axios = require('axios');
const help = require('../utils/help');

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
        this.state.msgInterval = null;

        this.state.connection = null;
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
          
            //Long polling
            axios.post('/api/message/last')
                .then((e) => {
                    console.log(e.data);
                    this.longPoll(e.data[0]._id);
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

        if(this.state.msgInterval) {
            clearInterval(this.state.msgInterval);
            document.title = 'Pulse';
        }

        document.getElementById('cidal' + id).innerHTML = '0';
        document.getElementById('cidal' + id).classList.add('template');

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

        if(!this.state.currentExist)
        {
            axios.post('/api/message/whisper',data)
                .then((e) => {
                    console.log(e.data);
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
                    console.log(e);
                    msgBox.value = '';
                })
                .catch((e) => {
                    console.log('WTF');
                    console.log(e);
                })
        }
        
    }

    componentWillUnmount() {
        this.state.longpoll = false;
        console.log('unmount');
    }

    longPoll(id) {
        axios.post('/api/message/updates',{
            id : id
        }).then((e) => {
            console.log(e.data);
            if(this.state.longpoll)
                this.longPoll(e.data[e.data.length - 1]._id);
            this.setState({
                msgs : e.data.filter(e => e.cid == this.state.currentChat)
            });

            try {
                let s = {};
                for(let i = 0; i < e.data.length; ++i)
                {
                    if(e.data[i].cid == this.state.currentChat)
                        continue;
                    
                    if(!s['cidal' + e.data[i].cid])
                        s['cidal' + e.data[i].cid] = 1;
                    else
                        s['cidal' + e.data[i].cid]++;
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
                    this.state.msgInterval = setInterval(() => {
                        j++;
                        j = j % 2;
                        document.title = b[j];
                    },1000);
                }


            }
            catch(v)
            {
                console.log(v);
            }

        }).catch((e) => {
            console.log('longPollError')

            setTimeout(() => {
                if(this.state.longpoll)
                    this.longPoll(id);
            },5000);
        });
    }

    render() {
        return (
            <div className="big standart-back relative">
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
                <div className="right-box relative">
                    <div className="message-panel-big" id="messagePanel">
                        <MessagePanel newMsg={this.state.msgs} me={this.state.me} members={this.state.chats.members} id={this.state.currentChat} exists={this.state.currentExist}/>
                    </div>
                    <div className="send-panel">
                        <div className="send-input relative"><input onKeyUp={(e) => { if(e.key == 'Enter') this.send(); }} id="msg" type="text" autoComplete="off" name="msgbox" placeholder="Сообщение..." />
                            <div className="emoji-button" id="emojiButton"></div>
                            <div className="send-button" id="send">
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