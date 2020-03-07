import React from 'react';
import ReactDOM from 'react-dom';

import Overlay from './pages/components/overlay';
import InProgress from './pages/progress';
import Chat from './pages/chat';

import './page.css';
import './page_min.css';

const axios = require('axios');
const help = require('./utils/help');

class Page extends React.Component {
    constructor(prop) {
        super(prop);

        this.state = {}
        this.state.currentPage = null;
        this.state.currentButton = '';
        this.state.pageName = '';

        this.pages = {};
        this.pages['mp'] = <InProgress />; 
        this.pages['np'] = <InProgress />;
        this.pages['tp'] = <InProgress />;
        this.pages['cp'] = <Chat />;

        this.pagesName = {};
        this.pagesName['mp'] = 'Main'; 
        this.pagesName['np'] = 'News';
        this.pagesName['tp'] = 'Time table';
        this.pagesName['cp'] = 'Chat';

        this.hideAlert = this.hideAlert.bind(this);

        this.overlay = React.createRef();
    }

    componentDidMount() {

        let page = help.getCookie('page')
        if(page)
            this.menuButtonClicked({ currentTarget : {id : page}});
    }

    logOut() {
        axios.post('/logout')
            .then(() => {
                window.location.reload(true);
            })
            .catch((e) => {
                console.log('WTF');
                console.log(e);
            })
    }

    hideAlert() {

    }

    riseLogOutAlert() {
        this.overlay.current.rise({
            msg : "Выйти?", 
            ok : "Выход",
            okAction : this.logOut,
            cancelAction:this.hideAlert
        });
    }

    menuButtonClicked(e) {

        let pageId = e.currentTarget.id;
        if(this.state.currentButton == pageId)
        {
            return;
        }

        let content = document.getElementById('content');
        content.classList.add('central-panel-offset');
        content.classList.add('central-panel-invis');

        
        this.setState({
            currentPage : this.pages[pageId],
            pageName : this.pagesName[pageId]
        })

        setTimeout(() => {
            content.classList.add('central-panel-shadow');
            content.classList.add('central-panel-transition');
            content.classList.remove('central-panel-offset');
            content.classList.remove('central-panel-invis');
        },10)

        setTimeout(() => {

            content.classList.remove('central-panel-transition');
            content.classList.remove('central-panel-shadow');
        }, 340);

        if(document.getElementById(this.state.currentButton))
            document.getElementById(this.state.currentButton).removeAttribute('selected');
        this.state.currentButton = pageId;
        document.cookie = `page=${pageId}; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
        document.getElementById(this.state.currentButton).setAttribute('selected', 'selected');;

    }

    render() {
        return (
        <div>
            <Overlay ref={this.overlay} />
            <div className="back"></div>
            <div className="main">
                <div className="top-panel">
                    <div className="page-name">{this.state.pageName}</div>
                </div>
                <div className="left-panel">
                    <div className="left-panel-top">
                        <div className="mbutton" id="mp" onClick={(e) => {this.menuButtonClicked(e)}} selected="selected">
                            <div className="main-button"> </div>
                        </div>
                        <div className="mbutton" id="np" onClick={(e) => {this.menuButtonClicked(e)}}>
                            <div className="news-image"></div>
                        </div>
                        <div className="mbutton" id="tp" onClick={(e) => {this.menuButtonClicked(e)}}>
                            <div className="table-image"></div>
                        </div>
                        <div className="mbutton" id="cp" onClick={(e) => {this.menuButtonClicked(e)}}>
                            <div className="chat-image"></div>
                        </div>
                    </div>
                    <div className="left-panel-bottom">
                        <div onClick={(e) => {this.riseLogOutAlert()}} className="mbutton" id="logout">
                            <div className="logout-image"></div>
                        </div>
                    </div>
                </div>
                <div className="central-panel" id="content">
                    {this.state.currentPage}
                </div>
            </div>
        </div>)
    }
}

export default Page;