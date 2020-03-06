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

        let emoji = data.msg.match(/::(.*?);/g);

        if(emoji)
        {
            for(let i = 0; i < emoji.length; ++i)
            {
                let path = '/emoji/svg/';
                path += emoji[i].slice(2,emoji[i].length - 1);
                data.msg = data.msg.replace(emoji[i],
                    `<img class="emoji-small-text" src="${path}" />`);
            }
        } 

        if(this.props.me == false) {
            let className = "message-item";
            if(data.anim) 
                className += " left-offset easy-delay opacity-0";

            return (
                <div className={className} id={'mid' + data._id}>
                    <div style={{background : data.color}} className="message-item-avatar">{data.from.toUpperCase()[0]}</div>
                    <div className="message-item-content">
                        <div className="message-item-owner">{data.from}</div>
                        <div className="message-item-msg" dangerouslySetInnerHTML={{__html: data.msg}}></div>
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
                        <div style={{background : data.color}}  className="message-item-avatar">{data.from.toUpperCase()[0]}</div>
                    </div>
                    <div className="message-item-content">
                        <div className="message-item-owner">{data.from}</div>
                        <div className="message-item-msg" dangerouslySetInnerHTML={{__html: data.msg}}></div>
                        <div className="message-item-date">{help.time(data.date)}</div>
                    </div>
                </div>
            );
        }
    }
}

export default MessageItem;