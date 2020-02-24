import React from 'react';
import ReactDOM from 'react-dom';

import Login from './login';
import Load from './load';
import Register from './register';
import Page from './page';

import './style.css';

const axios = require('axios');
const help = require('./utils/help');

class App extends React.Component {
    constructor(prop) {
        super(prop);

        this.state = {
            current : (<Load />)
        }

        this.goToLogin = this.goToLogin.bind(this);
        this.goToPage = this.goToPage.bind(this);
        this.goToRegister = this.goToRegister.bind(this);
    }

    amISignedIn() {
        let token = help.getCookie('token');
        if(!help.isEmptyOrSpaces(token))
        {
            axios.post('/api/message/test')
                .then((data) => {
                    console.log(data);
                    if(data.data === 'MESSAGE')
                    {
                        this.goToPage();
                    }
                    else
                    {
                        //WTF?
                    }
                })
                .catch((err) => {
                    this.goToLogin();
                });
        }
        else
        {
            this.goToLogin();
        }
    }

    goToLogin() {
        let state = this.state;
        state.current = <Login toReg={this.goToRegister} toPage={this.goToPage} />
        this.setState(state);
    }

    goToRegister() {
        let state = this.state;
        state.current = <Register toLogin={this.goToLogin} />
        this.setState(state);
    }

    goToPage() {
        let state = this.state;
        state.current = <Page />
        this.setState(state);
    }

    componentDidMount() {
        this.amISignedIn();
    }

    render() {
        return (<div>{this.state.current}</div>);
    }
}

export default App;