import React from 'react';
import ReactDOM from 'react-dom';

const axios = require('axios');
const help = require('../../utils/help');

class MessagePanel extends React.Component {

    constructor(prop) {
        super(prop);

        this.state = {}
        this.state.messages = [];
    }

    notSelected() {
        return (
            <div className="no-selected-chat"> Чтоб <b>начать</b> выбери чат из списка <i>слева</i></div>
        );
    }

    noMessages() {
        return (
            <div className="no-messages">
                <div className="no-messages-logo"></div>
                <div className="no-messages-content">
                    Кажется тут еще <b>нет</b> сообщений. Напиши <i>первое</i>!
                </div>
            </div>
        );
    }

    aLotOfMessages() {
        return (
            <div className="message-panel" id="messagePanel2">
                <div className="message-list">
                    {this.state.messages.map(m => this.message(m))}
                </div>
            </div>
        );
    }

    message(data) {

        let user = this.props.members.find(u => u._id == data.uid);
        data.from = user.name;
        
        if(data.uid !== this.props.me._id)
            return (
                <div key={'mid' + data._id} className="message-item" id={'mid' + data._id}>
                    <div className="message-item-avatar">{data.from[0]}</div>
                    <div className="message-item-content">
                        <div className="message-item-owner">{data.from}</div>
                        <div className="message-item-msg">{data.msg}</div>
                        <div className="message-item-date">{help.time(data.date)}</div>
                    </div>
                </div>
            );
        else
            return (
                <div key={'mid' + data._id} className="message-item msg-me"  id={'mid' + data._id}>
                    <div className="me-avatar-fix">
                        <div className="message-item-avatar">{data.from[0]}</div>
                    </div>
                    <div className="message-item-content">
                        <div className="message-item-owner">{data.from}</div>
                        <div className="message-item-msg">{data.msg}</div>
                        <div className="message-item-date">{help.time(data.date)}</div>
                    </div>
                </div>
            );
    }

    componentDidUpdate(prevProps) {

        if(prevProps.id != this.props.id && this.props.exists) {
            axios.post('/api/message/history',{
                id : this.props.id,
                limit : 20
            }).then((e) => {
                e.data.reverse();
                this.setState({
                    messages : e.data
                })

            }).catch((e) => {
                console.log('WTF');
                console.log(e);
            });
        }
        else if(prevProps.newMsg  != this.props.newMsg)
        {
            let msgs = this.state.messages;
            msgs = msgs.concat(this.props.newMsg);

            this.setState({
                messages : msgs
            })

            console.log(this.state.messages);
            

        } else {

            let objDiv = document.getElementById("messagePanel2");

            if(objDiv)
                objDiv.scrollTop = objDiv.scrollHeight;
        }
    }

    render() {

        if(this.props.id === '')
            return this.notSelected();
        else if(!this.props.exists)
            return this.noMessages();
        else {
            return this.aLotOfMessages();
        }
    }

}

export default MessagePanel;