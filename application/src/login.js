import React from 'react';
import ReactDOM from 'react-dom';

const axios = require('axios');
const help = require('./utils/help');

class Login extends React.Component {
    constructor(prop) {
        super(prop);
        console.log(prop);
    }

    render() {
        return (
        <div>
            <div className="back" id="pjs"></div>
            <div className="main" id="main">
                <div className="center">
                    <div className="middle">
                        <div className="box">
                            <div className="logo">
                                <div className="top">ITMM</div>
                                <div className="bot"><span>PULSE</span></div>
                            </div>
                            <div className="form">
                                <input id="itlogin" type="text" name="itlogin" placeholder="Login" />
                                <input id="itpassword" type="password" name="itpassword" placeholder="Password" />
                                <div className="reg-info" id="resInfo"></div>
                                <div onClick={() => this.signInClicked()} className="button submit" id="sin">sign in</div>
                                <div onClick={() => {this.props.toReg()}} className="button small" id="cos">sign up</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
};

export default Login;