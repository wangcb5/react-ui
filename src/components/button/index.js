import React, {Component} from 'react'
import './index.scss'
import PropTypes from 'prop-types'
import define from "@comp/define";

class LeButton extends Component{
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
        this.tag = this.props.tag == 'submit' ? 'submit' : 'button';
        this.state = {
            disabled: this.props.disabled
        }

    }

    /******* 生命周期 start *********/
    // componentDidMount(){
    //     this.buttonRef.current.addEventListener('click', this.ripplesHandler)
    // }
    //
    // componentWillUnmount() {
    //     this.buttonRef.current.removeEventListener('click', this.ripplesHandler);
    // }
    /******* 生命周期 end *********/

    /********* method start **************/
    ripplesHandler=(e)=> {
        if (this.props.tag == 'submit') return;
        let x = e.pageX;
        let y = e.pageY;
        let left = this.buttonRef.current.offsetLeft;
        let top = this.buttonRef.current.offsetTop;
        let ripples = document.createElement("span");
        ripples.classList.add("_ripples");
        ripples.style.left = x - left + "px";
        ripples.style.top = y - top + "px";
        this.buttonRef.current.appendChild(ripples);
        setTimeout(() => {
            ripples.remove();
        }, 1000);
    }

    getType() {
        let typeList = define.buttonType.join(',');
        if (typeList.indexOf(this.props.type) == -1) {
            return 'default'
        }
        return this.props.type
    }

    resetDisabled() {
        this.setState({
            disabled: false
        })
    }

    /********* method end **************/


    /************  event start  ***************/
    onClick=(e)=>{
        this.ripplesHandler(e);
        if (this.props.tag != 'button') {
            this.onSubmit()
        } else {
            this.props.onClick && this.props.onClick()
        }
    }
    onSubmit=()=>{
        if (this.props.onSubmit) {
            this.setState({
                disabled: true
            });
            this.props.onSubmit().then(data => {
                this.setState({
                    disabled: false
                })
            }).catch(err => {
                this.setState({
                    disabled: false
                })
            })
        }
    }

    /************  event end  ***************/

    render() {
        const type  = this.getType();
        const {value,iconName,style} = this.props;
        const {disabled} = this.state;
        return (
            <div className="le_button_box" style={style}>
                <button type={this.tag}
                        className={`le_button ${type}`}
                        ref={this.buttonRef}
                        disabled={disabled}
                        onClick={this.onClick}
                        >
                    {value}
                    <i className={`fa fa-lg ${iconName}`}></i>
                </button>
            </div>
        )
    }
}

LeButton.defaultProps = {
    disabled: false,
    type: 'default',
    value: '',
    iconName: '',
    tag: '',
    style: {}
};

LeButton.propTypes = {
    type: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    iconName: PropTypes.string,
    onClick: PropTypes.func,
    onSubmit: PropTypes.func,
    tag: PropTypes.string,
    style: PropTypes.object
};

export default LeButton