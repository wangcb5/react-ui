import './index.scss'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import tool from '@core/tool'
import Ajax from '@core/fetch'

class AutoCompleted extends Component{
    static propTypes = {
        placeholder: PropTypes.string,
        displayName: PropTypes.string,
        displayValue: PropTypes.string,
        label: PropTypes.string,
        change: PropTypes.func,
        clear: PropTypes.func,
        url: PropTypes.string,
        disabled: PropTypes.bool,
        analysis: PropTypes.func
    };
    static defaultProps = {
        placeholder: '请选择',
        displayName: 'name',
        displayValue: 'code',
        label: '',
        url: '',
        disabled: false,
    };

    constructor(props) {
        super(props);
        this._idSeed = tool._idSeed.newId();
        this.inputRef = React.createRef();
        this._activeIndex = -1;
        this.state = {
            active: false,
            have: false,
            show: false,
            mouseOver: false,
            selectData: [],
            data: [],
            disabled: props.disabled,
            value: ''
        }
    }

    /***********  生命周期 start *************/
    componentDidMount() {
        this.init();
    }
    componentWillUnmount() {
        document.body.removeEventListener('click', this.bodyClick);
    }
    /***********  生命周期 over *************/

    /***********  method start *************/
    init() {
        document.body.addEventListener('click', this.bodyClick);
    }
    bodyClick=(e)=> {
        const {have, active, show} = this.state;
        if (!active && !have && !show || this.state.disabled || !this.props.url) return;
        if (this.state.data.length > 0 || this.state.value) {
            this.setState({
                have: false,
                show: false
            })
        } else {
            this.setState({
                active: false,
                have: false,
                show: false
            })
        }
    };
    getClearIconBox=()=> {
        const {have, value, mouseOver} = this.state;
        return (
            <div
                className='le_select_icon'
                onClick={this.clear}
                style={{
                    display: mouseOver ? '' : 'none'
                }}
            >
                <i
                    className={`fa fa-times-circle  ${have ? 'have' : ''}`}
                    aria-hidden="true"
                ></i>
            </div>
        )
    };

    setDisabled=(flag)=>{
        if (flag == this.state.disabled)return;
        this.setState({
            disabled: flag
        })
    };

    setValue=(obj)=>{
        if (!obj)return;
        let arr = this.state.selectData;
        obj = tool.object.cloneObj(obj);
        if (obj instanceof Array) {
            arr.concat(obj)
        } else {
            arr.push(obj)
        }
            let newArr = [];
            newArr.push(arr[0]);
            arr = newArr;
        this.setState({
            selectData: arr,
            active: true,
            value: arr[0][this.props.displayName]
        })
    };
    getValue=()=>{
        return this.state.selectData
    };

    clear=()=>{
        this.setState({
            data: [],
            selectData: [],
            have: false,
            active: false,
            value: ''
        })
    };



    /***********  method over *************/

    /***********  event start *************/
    onMouseOver=(e)=> {
        const {disabled, value, mouseOver} = this.state;
        if (disabled)return;
        if (!mouseOver && value) {
            this.setState({
                mouseOver: true
            },()=> {

            })
        }
    };
    onMouseOut=(e)=> {
        const {disabled, mouseOver} = this.state;
        if (disabled)return;
        if (mouseOver) {
            this.setState({
                mouseOver: false
            })
        }
    };
    inputOnClick=(e)=> {
        if ( !this.props.url || this.state.disabled) {
            return
        }
        this.setState({
            active: true,
            have: true,
            show: true
        }, ()=> {
            this.inputRef.current.focus()
        })
    };
    onChange=(e)=> {
            this.setState({
                value: e.target.value,
                mouseOver: e.target.value ? true : false
            }, () => {
                if (!this.props.url)return;
                Ajax.getFetch(this.props.url + this.state.value,false).then(x=>{
                    let tmp = this.props.analysis(x.data);
                    if(!tool.comp.checkArrayNull(tmp)){
                        tmp = tool.comp.addPrimaryAndCk(tmp);
                        this.setState((prevState)=>{
                            return {
                                data:tmp
                            }
                        })
                    } else {
                        if (this.state.data.length) {
                            this.setState({
                                data: [],
                            })
                        }
                    }
                })
            })
    };
    keyUp = (e)=>{
        if(this.state.data.length == 0){
            return;
        }
        if(e.keyCode == "40"){
            if(this._activeIndex == -1 || this._activeIndex == this.state.data.length - 1){
                this._activeIndex = 0;
            }else{
                this._activeIndex += 1;
            }
            console.log(this._activeIndex)
        }
        if(e.keyCode == "38"){
            if(this._activeIndex == -1 || this._activeIndex == 0){
                this._activeIndex = this.state.data.length - 1;
            }else{
                this._activeIndex -= 1;
            }
        }

        let currentItem = this.state.data[this._activeIndex];
        if(e.keyCode == "13"){
            this.onClick(e, currentItem);
        }
        if(!currentItem || (e.keyCode != '40' && e.keyCode != '38'&&e.keyCode != '13')){
            return;
        }
        this.setState({
            data:this.state.data,
            value: currentItem[this.props.displayName],
            selectData: currentItem
        })

    }
    onClick=(e, item)=> {
        const {disabled, value} = this.state;
        const {displayValue, displayName} = this.props;
        if (disabled)return;
        if (item && value == item[displayValue])return;
        this.setState({
            selectData: [
                item
            ],
            have: true,
            active: true,
            value: item[displayName],
            show: false
        });
    }
    /************ event over  ************/


    render() {
        const {active, have, show, mouseOver, data, selectData, disabled, value} = this.state;
        const {placeholder, displayName, displayValue, label} = this.props;
        let menuHtml = '';
        let bool = false;
        menuHtml = data.map((item, index) => {
            if (value == item[displayName]) {
                this._activeIndex = index;
                bool = true
            }
                return (
                    <div
                        className={`le_select_menu_item ${value == item[displayName] ? 'active' : ''}`}
                        onClick={(e) => this.onClick(e, item)}
                        key={index}
                    >
                        <div
                            className="le_select_menu_item_content">
                            <div className="le_select_menu_item__content_title"
                            >{item[displayName]}</div>
                        </div>
                    </div>
                )
            });
        if (!bool) {
            this._activeIndex = -1;
        }


        return (
            <div className={'le_select_container'}>
                <div
                    className={`le_select_box ${active ? 'active' : '' } ${have ? 'have' : ''} ${disabled ? 'disabled' : ''}`}
                    onMouseOver={this.onMouseOver}
                    onMouseOut={this.onMouseOut}
                >
                    <label
                        htmlFor={'select_' + this._idSeed}
                        className={`le_select_label ${active ? 'active' : ''} ${have ? 'have' : ''}`}
                    >{label}</label>
                    <div
                        className="le_select_selections"
                        onClick={this.inputOnClick}
                    >
                        <input
                            placeholder={(active && !selectData.length) ?  placeholder : ''}
                            id={'select_' + this._idSeed}
                            ref={this.inputRef}
                            // readOnly="readonly"
                            onChange={this.onChange}
                            type="text"
                            value={value}
                            autoComplete="off"
                            onKeyUp={this.keyUp}
                        />
                    </div>
                    {this.getClearIconBox()}
                </div>
                <div
                    className={`le_select_menu ${show && data.length ? 'show' : 'hide'}`}
                >
                    <div
                        className={'le_select_menu_box'}
                    >
                        {menuHtml}
                    </div>
                </div>
                <div
                    className={'le_select_detail'}>
                    <div
                        className={'le_select_detail_error'}>
                        123
                    </div>
                </div>
            </div>
        );
    }
}

export default AutoCompleted
