import React from 'react';
import ReactDOM from 'react-dom';

const help = require('../../../utils/help');

class MessageItem extends React.Component {
    constructor(prop) {
        super(prop);

        this.state = {}
    }

    componentDidMount() {
        let msg = document.getElementById('mid' + this.props.data._id);
        setTimeout(() => {
            msg.classList.remove('left-offset');
            msg.classList.remove('opacity-0');
        },20)
    }

    render() {
        let data = this.props.data;
        if(this.props.me == false) {
            let className = "message-item";
            if(data.anim) 
                className += " left-offset easy-delay opacity-0";

            return (
                <div className={className} id={'mid' + data._id}>
                    <div className="message-item-avatar">{data.from[0]}</div>
                    <div className="message-item-content">
                        <div className="message-item-owner">{data.from}</div>
                        <div className="message-item-msg">{data.msg}</div>
                        <div className="message-item-date">{help.time(data.date)}</div>
                    </div>
                </div>
            );
        }
        else {
            let className = "message-item msg-me";
            if(data.anim)
                className += " left-offset easy-delay opacity-0";

            return (
                <div className={className}  id={'mid' + data._id}>
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
    }
}

export default MessageItem;