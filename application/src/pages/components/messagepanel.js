import React from 'react';
import ReactDOM from 'react-dom';

import MessageItem from './bricks/message';

const axios = require('axios');
const help = require('../../utils/help');



class MessagePanel extends React.Component {

    constructor(prop) {
        super(prop);

        this.state = {}
        this.state.messages = [];

        this.state.clicks = 0;

        this.componentDidUpdate = this.componentDidUpdate.bind(this);
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
            <div>
                <div id="messageLoader" className="message-panel-loader">
                    <div className="loader"></div>
                </div>
                <div className="message-panel" id="messagePanel2">
                    <div className="message-list">
                        {this.state.messages.map(m => this.message(m))}
                    </div>
                </div>
            </div>
        );
    }

    message(data) {

        let user = this.props.members.find(u => u._id == data.uid);
        data.from = user.name;
        data.color = user.color;
        
        if(data.uid !== this.props.me._id)
        {
            return <MessageItem data={data} me={false} key={data._id} />
        }  
        else
        {
            return <MessageItem data={data} me={true} key={data._id} />
        }
            
    }

    componentDidUpdate(prevProps) {

        if(prevProps.id != this.props.id && this.props.exists) {

            let loader = document.getElementById('messageLoader');
            loader.classList.remove('opacity-0');
            loader.classList.remove('display-none');

            setTimeout(() => {
                loader.classList.add('delay');
            },10)

            this.state.clicks++;

            axios.post('/api/message/history',{
                id : this.props.id,
                limit : 20
            }).then((e) => {
                e.data.reverse();
                this.setState({
                    messages : e.data
                })

                this.state.clicks--;
                if(this.state.clicks === 0) {
                    loader.classList.add('opacity-0');
                    setTimeout(() => {     
                        if(this.state.clicks === 0) {
                            loader.classList.add('display-none');      
                            loader.classList.remove('delay');  
                        }  
                    },200);
                }

            }).catch((e) => {
                console.log('WTF');
                console.log(e);
            });
        }
        else if(prevProps.newMsg  != this.props.newMsg)
        {
            let msgs = this.state.messages;

            let news = this.props.newMsg.map(m => { return { ...m, anim : true}});;
            msgs = msgs.concat(news);

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

    componentWillUnmount() {
        console.log('Message panel unmount');
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