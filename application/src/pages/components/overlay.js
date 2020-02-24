import React from 'react';
import ReactDOM from 'react-dom';

class Overlay extends React.Component {
    constructor(prop) {
        super(prop);

        this.state = {}
        this.state.modeStyle = 'ov-hidden';
        this.state.alertStyle = 'al-down';

        this.state.msg = '';
        this.state.ok = '';
        this.state.okAction = () => {};
        this.state.cancelAction = () => {};
    }

    dismiss() {
        this.setState({
            modeStyle : 'ov-hidden',
            alertStyle : 'al-down'
        })

        this.state.cancelAction();
    }

    rise(data) {
        this.setState({
            msg : data.msg,
            ok : data.ok,
            okAction : data.okAction,
            cancelAction : data.cancelAction,

            modeStyle : '',
            alertStyle : ''
        })
    }

    render() {
        return (
            <div className={'up-overlay ' + this.state.modeStyle} id="overlay">
                <div className="overlay-back" onClick={() => {this.dismiss()}}></div>
                <div className={'alert ' + this.state.alertStyle} id="alert">
                    <div className="alert-content" id="acontent">{this.state.msg}</div>
                    <div className="alert-buttons">
                        <div className="button small" onClick={() => {this.dismiss()}} id="acancel">назад</div>
                        <div className="button submit" onClick={() => {this.state.okAction()}} id="aok">{this.state.ok}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Overlay;