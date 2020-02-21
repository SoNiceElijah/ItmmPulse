import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

class Load extends React.Component {
    constructor(prop) {
        super(prop);
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Load;