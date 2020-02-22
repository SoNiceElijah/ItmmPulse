import React from 'react';
import ReactDOM from 'react-dom';

const axios = require('axios');
const help = require('./utils/help');

class Register extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            class : {
                name : '',
                user : '',
                pw1 : '',
                pw2 : ''
            },

            info : 'green-color',
            msg : ''
        };
    }

    register() {

        let data = help.validate(document,['name','login','pw1','pw2']);
        
        if(data.errors.length !== 0)
        {
            let newStyle = {
                name : '',
                login : '',
                pw1 : '',
                pw2 : ''
            };
            for(let i = 0; i < data.errors.length; ++i)
            {
                newStyle[data.errors[i]] = 'mistake';
            }

            this.setState({
                class : newStyle
            })
        }
        else
        {
            let pw1 = help.val(document,'pw1');
            let pw2 = help.val(document,'pw2');

            console.log(pw1);

            if(pw1 != pw2)
            {
                let styles = this.state.class;
                styles.pw1 = 'mistake';
                styles.pw2 = 'mistake';
                this.setState({ class : styles});
            }
            else
            {
                axios.post('/register',{
                    name : data.name,
                    username : data.login,
                    password : data.pw1
                }).then(() => {
                    this.setState({
                        info : 'green-color',
                        msg : 'Успешно!'
                    })
                }).catch(() => {
                    this.setState({
                        info : 'red-color',
                        msg : 'Что-то пошло не так. Скорее всего такое имя уже знято'
                    })
                })
            }
        }
    }

    noColor(e) {
        let styles = this.state.class;
        styles[e.target.id] = "";
        this.setState({ class : styles});

        console.log(this.state);
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
                                <input id="name" onChange={(e) => this.noColor(e)} className={this.state.class.name} type="text" name="itname" placeholder="name" />
                                <input id="login" onChange={(e) => this.noColor(e)} className={this.state.class.login} type="text" name="ituser" placeholder="login" />
                                <input id="pw1" onChange={(e) => this.noColor(e)} className={this.state.class.pw1} type="password" name="itpass1" placeholder="password" />
                                <input id="pw2" onChange={(e) => this.noColor(e)} className={this.state.class.pw2} type="password" name="itpass2" placeholder="password again" />

                                <div className={"reg-info " + this.state.info} id="resInfo">{this.state.msg}</div>
                                <div className="button submit" onClick={() => {this.register()}} id="reg">sign up</div>
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