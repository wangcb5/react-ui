import React from 'react'
import CommonUtil from "@core/tool";
import PropTypes from 'prop-types'
import './index.scss'

export default class LeInput extends React.Component{
    constructor(props) {
        super(props);
        this._idSeed = CommonUtil._idSeed.newId();
        this.inputRef = React.createRef();

        this.state= {
            cls: '',
            focus:false
        };
    }

    focusHandler(event){
        if (!this.props.value){
            this.setState({
                focus: true
            })
        }
        this.props.onFocus && this.props.onFocus(event)
    }

    blurHandler(event){
        if (!this.props.value){
            this.setState({
                focus: false
            })
        }
        this.props.onBlur && this.props.onBlur(event)
    }

    changeHandler(event) {
        this.props.onChange &&  this.props.onChange(event)
    }

    onKeyPress(event){
        this.props.onKeyPress &&  this.props.onKeyPress(event)
    }

    init() {

    }

    clear(event){
        this.inputRef.current.value = '';
        this.setState({
            focus: false
        });
        this.props.onChange &&  this.props.onChange(event);
    }

    componentDidMount() {
        this.init()
    }


    render() {
        const {disabled, label, value,tips, errorMsg} = this.props;
        let type = this.props.type;
        let placeholder = this.props.placeholder;
        if (type != 'text' && type != 'password') {
            type = 'text'
        }
        if (!this.state.focus) {
            placeholder = ''
        }

        return (
            <div className={`input_group ${this.state.focus?"focus":""}`}>
                <div className="input_control">
                    <div className="input_slot">
                        <div className="text_field">
                            <label htmlFor={'input_' + this._idSeed}>{label}</label>
                            <input
                                id={'input_' + this._idSeed}
                                disabled={disabled}
                                value={value}
                                type={type}
                                placeholder={placeholder}
                                onChange={(e) => this.changeHandler(e)}
                                onFocus={(e) => this.focusHandler(e)}
                                onBlur={(e) => this.blurHandler(e)}
                                onKeyPress={(e) => this.onKeyPress(e)}
                                ref={this.inputRef}
                            />
                            {
                                !this.state.focus || !this.inputRef.current.value ? '' :
                                <i onClick={(e) => this.clear(e)} className='input_icon_close'></i>
                            }
                        </div>
                    </div>
                    <div className="input_detail">
                        <div className="input_detail_tips">
                            {tips}
                        </div>
                        <div className="input_detail_errorMsg">
                            {errorMsg}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LeInput.defaultProps = {
    disabled: false,
    type: 'text'
};

LeInput.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    tips: PropTypes.string,
    errorMsg: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    onkeypress: PropTypes.func
};

