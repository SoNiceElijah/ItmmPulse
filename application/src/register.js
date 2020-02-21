import React from 'react';
import ReactDOM from 'react-dom';

const axios = require('axios');
const help = require('./utils/help');

class Register extends React.Component {
    constructor(prop) {
        super(prop);
    }

    render() {
        return (
        <div>
            <div className="back" id="pjs"></div>
            <div className="main" id="main">
                <div className="fix-header">
                    <a className="small-logo" onClick={() => {this.props.toLogin();}}>ITMM<span>PULSE</span></a>
                </div>
                <div className="center big-width f-height">
                    <div className="middle">
                        <div className="box big-width text-center">
                            <div className="info-part">
                                <h1>Hello!</h1>
                                <p>
                                    Привет!
                                    <b>Большое</b> <i>спасибо</i>, что принимаешь участие в <b>EARLY-ALPHA</b> тесте нашего приложения.
                                    Это один из самых ранних билдов, и он полон ошибок.
                                    Для того, чтоб отладить работу и сделать приложение максимально удобным
                                    нам нужна <i>твоя</i> помощь. 
                                </p>
                            </div>
                            <div className="form-part form">
                                <input id="name" type="text" name="itname" placeholder="name" />
                                <input id="login" type="text" name="ituser" placeholder="login" />
                                <input id="pw1" type="password" name="itpass1" placeholder="password" />
                                <input id="pw2" type="password" name="itpass2" placeholder="password again" />

                                <div className="reg-info" id="resInfo"></div>
                                <div className="button submit" id="reg">sign up</div>
                                <div className="button small" onClick={() => {this.props.toLogin();}}>login page</div>

                            </div>
                        </div>
                        <div className="fix-footer"></div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Register;