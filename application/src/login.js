import React from 'react';
import ReactDOM from 'react-dom';

const axios = require('axios');
const help = require('./utils/help');

class Login extends React.Component {
    constructor(prop) {
        super(prop);

        this.state = {}
        this.state.itloginStyle = '';
        this.state.itpasswordStyle = '';

    }

    signIn() {
        let data = help.validate(document, ['itlogin','itpassword']);

        console.log(data);

        if(data.errors.length === 0)
        {

            axios.post('/login',{
                username : data.itlogin,
                password : data.itpassword
            }).then((e) => {

                console.log('Success!');
                console.log(e);
                document.cookie = `token=${e.data.token}; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
                window.location.reload(true);
            }).catch(() => {
                document.getElementById('resInfo').innerHTML = "Неверный логин/пароль";
            })
        }
        else
        {
            for(let i = 0; i < data.errors.length; ++i)
            {
                this.setState({[data.errors[i]+'Style'] : 'mistake'});
            }
        }
    }

    reset(e) {
        this.setState({[e.target.id + 'Style'] : ''});
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
                                <input id="itlogin" onChange={(e) => {this.reset(e)}} className={this.state.itloginStyle} type="text" name="itlogin" placeholder="Login" />
                                <input id="itpassword" onChange={(e) => {this.reset(e)}} className={this.state.itpasswordStyle} type="password" name="itpassword" placeholder="Password" />
                                <div className="reg-info red-color" id="resInfo"></div>
                                <div onClick={() => this.signIn()} className="button submit" id="sin">sign in</div>
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