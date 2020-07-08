import React, {Component} from 'react'
import './index.scss'
import PropTypes from 'prop-types'

class Alert extends Component{
    constructor(props) {
        super(props);
        this.timer = null;

        this.state = {
            alertShow: false,
            alertMsg: '',
            type: 'success',
        }
    }
    showAlert(msg, time, cb){
        this.setState({
            alertShow: true,
            alertMsg: msg
        }, () => {
            this.timer = setTimeout(() => {
                this.closeAlert();
                cb && cb();
            }, time || 1000)
        })
    }

    closeAlert(){
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.setState({
            alertShow: false,
            alertMsg: ''
        })
    }

    render() {
        const {alertShow, alertMsg, type} = this.state;
        if (!alertShow) return null;

        return (
            <div className={`le_alert_box`}>
                <div className={`le_alert_box_content ${type}`}>
                    <div className="le_alert_box_wrapper">
                        <i className="fa fa-check-square-o" aria-hidden="true"></i>
                        <div>
                            {alertMsg}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Alert