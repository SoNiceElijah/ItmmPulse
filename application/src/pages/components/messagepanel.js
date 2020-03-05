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
        this.getHistory = this.getHistory.bind(this);
        this.messageArray = this.messageArray.bind(this);

        this.state.rescroll = true;
        this.state.full = true;

        this.state.topdiff = 0;

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
                <div className="message-panel" onScroll={(e) => {this.scrollHandler(e)}} id="messagePanel2">
                    <div className="message-top-loading" id="historyLoader">
                        <div className="loader"></div>
                    </div>
                    <div className="message-list">
                        {this.messageArray(this.state.messages)}
                    </div>
                </div>
            </div>
        );
    }

    messageArray(msgs) {

        if(msgs.length == 0)
            return;

        let datestr = help.timeDate(msgs[0].date);
        let components = [];

        components.push(this.dateStringComponent(datestr));

        let laststr = datestr;
        for(let i = 0; i < msgs.length; ++i)
        {
            datestr = help.timeDate(msgs[i].date);
            if(datestr != laststr)
            {
                components.push(this.dateStringComponent(datestr));
            }

            components.push(this.message(msgs[i]));
            laststr = datestr;
        }

        return components;
    }

    dateStringComponent(str) {
        return (
            <div key={str} className="message-date-string relative">
                <div className="message-line "></div>
                <div className="message-date-string-content">{str}</div>
            </div>
        );
    }

    message(data) {

        let user = this.props.findUser(data.uid);
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

            this.state.full = true;
            this.state.messages = [];
            this.getHistory(true);
            this.state.rescroll = true;
            
        }
        else if(prevProps.newMsg != this.props.newMsg)
        {
            let msgs = this.state.messages;

            let news = this.props.newMsg.map(m => { return { ...m, anim : true}});;
            msgs = msgs.concat(news);

            let mids = msgs.map(m => m._id);
            msgs = msgs.filter((e,i) => mids.indexOf(e._id) === i );

            this.state.rescroll = true;

            this.setState({
                messages : msgs
            })            

        } else {
        
            console.log('RESIZE?');
            let objDiv = document.getElementById("messagePanel2");

            if(objDiv)
            {
                if(this.state.rescroll)
                    objDiv.scrollTop = objDiv.scrollHeight;
                else
                    objDiv.scrollTop = objDiv.scrollHeight - this.state.topdiff;
            }
        }
    }

    componentWillUnmount() {
        console.log('Message panel unmount');
    }

    getHistory(watch = false) {

        document.getElementById('historyLoader').classList.remove('opacity-0');

        axios.post('/api/message/history',{
            id : this.props.id,
            limit : 20,
            skip : this.state.messages.length
        }).then((e) => {

            let loader = document.getElementById('messageLoader');

            let objDiv = document.getElementById("messagePanel2");

            if(objDiv)
                this.state.rescroll = objDiv.scrollHeight - objDiv.scrollTop === objDiv.clientHeight;

            e.data.reverse();

            let msgs = this.state.messages;

            msgs = e.data.concat(msgs);
            let mids = msgs.map(m => m._id);
            msgs = msgs.filter((e,i) => mids.indexOf(e._id) === i );

            if(e.data.length < 20) {
                document.getElementById('historyLoader').classList.add('opacity-0');
                this.state.full = true;
            }
            else
            {
                this.state.full = false;
            }

            if(objDiv)
                this.state.topdiff = objDiv.scrollHeight - objDiv.scrollTop;
            console.log(this.state.messages.length);

            this.setState({
                messages : msgs
            })



            if(watch) {
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
            }

        }).catch((e) => {
            console.log('WTF');
            console.log(e);
        });
    }

    scrollHandler(e) {

        let element = e.target;

        if(element.scrollTop == 0 && !this.state.full)
        {
            console.log('GOT HISTORY');
            this.getHistory();
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