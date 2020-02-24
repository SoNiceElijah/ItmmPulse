import React from 'react';
import ReactDOM from 'react-dom';

class InProgress extends React.Component {
    constructor(prop) {
        super(prop);
    }

    render() {
        return (
            <div className="big flex-center standart-back">
                <div className="box">
                    <div className="excuse-logo"></div>
                    <div className="excuse-msg"> Данная страница в <i>активной</i> стадии разработки Поэтому она пока что <b>недоступна :( </b></div>
                </div>
            </div>
        )
    }
}

export default InProgress;