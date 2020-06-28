import './index.scss'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import tool from '@core/tool'

class LeSelect extends Component{
    static propTypes = {
        placeholder: PropTypes.string,
        displayName: PropTypes.string,
        displayValue: PropTypes.string,
        label: PropTypes.string,
        multiple: PropTypes.bool,
        change: PropTypes.func,
        clear: PropTypes.func,
        data: PropTypes.array,
        disabled: PropTypes.bool
    };
    static defaultProps = {
        placeholder: '请选择',
        displayName: 'name',
        displayValue: 'code',
        label: '',
        multiple: false,
        data: [],
        disabled: false
    };
    constructor(props) {
        super(props);
        this._idSeed = tool._idSeed.newId();
        this.state = {
            active: false,
            have: false,
            show: false,
            mouseOver: false,
            selectData: [],
            data: props.data,
            disabled: props.disabled
        }
    }

    /***********  生命周期 start *************/
    componentDidMount() {
        this.init();
    }
    componentWillUnmount() {
        document.body.removeEventListener('click', this.bodyClick);
    }

    // shouldComponentUpdate(nextProps,nextState){
    //     if (this.state.active == nextState.active && this.state.have == nextState.have) {
    //         return  false
    //     } else {
    //         return true
    //     }
    // }
    /***********  生命周期 over *************/

    /***********  method start *************/
    init() {
        document.body.addEventListener('click', this.bodyClick);
    }
    bodyClick=(e)=> {
        const {have, active, show} = this.state;
        const {displayName} = this.props;
        if (!active && !have && !show || this.state.disabled) return;
        if (this.state.selectData.length > 0) {
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

    getSelectIconBox=()=> {
        const {show, have} = this.state;
        return (
            <div className='le_select_icon' onClick={this.onClick}>
                <i className={`fa fa-chevron-down ${show ? 'active' : ''} ${have ? 'have' : ''}`} aria-hidden="true"></i>
            </div>
        )
    };
    getClearIconBox=()=> {
        const {have} = this.state;
        return (
            <div
                className='le_select_icon'
                onClick={this.clear}
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
        this.setState({
            selectData: arr,
            active: true
        })
    };
    getValue=()=>{
        return this.state.selectData
    };

    clear=()=>{
        this.setState({
            selectData: [],
            have: false,
            active: false
        })
    };



    /***********  method over *************/

    /***********  event start *************/
    onMouseOver=(e)=> {
        const {displayName} = this.props;
        const {disabled} = this.state;
        if (disabled)return;
        if (this.state.mouseOver == false && this.state.selectData.length > 0) {
            this.setState({
                mouseOver: true
            })
        }
    };
    onMouseOut=(e)=> {
        const {disabled} = this.state;
        if (disabled)return;
        if (this.state.mouseOver) {
            this.setState({
                mouseOver: false
            })
        }
    };
    inputOnClick=(e)=> {
        if (!this.state.data || this.state.data.length < 1 || this.state.disabled) {
            return
        }
            this.setState({
                active: true,
                have: true,
                show: true
            })
    };
    onClick=(e, item)=> {
        const {disabled} = this.state;
        const {displayValue, multiple} = this.props;
        if (disabled)return;
        if (!multiple) {
            let value = this.state.selectData.length ? this.state.selectData[0][displayValue] : '';
            if (value == item[displayValue])return;
            this.setState({
                selectData: [
                    item
                ],
                have: true,
                active: true
            });
        } else{
            let arr  = tool.object.cloneObj(this.state.selectData);
            if (arr.length) {
                let filterArr = arr.filter(items => {
                    return items[displayValue] == item[displayValue]
                });
                if (filterArr.length) {
                    filterArr = filterArr[0];
                    if (arr.length > 1) {
                        for (let i = 0 ; i < arr.length; i ++) {
                            if (arr[i][displayValue] == filterArr[displayValue]) {
                                arr.splice(i, 1)
                            }
                        }
                    } else {
                        arr = []
                    }

                } else {
                    arr.push(item);
                }
                this.setState({
                    selectData: arr,
                    have: true,
                    active: true,
                    show: true
                });
            } else {
                this.setState({
                    selectData: [
                        item
                    ],
                    have: true,
                    active: true,
                    show: true
                });
            }
        }
    };
    /************ event over  ************/


    render() {
        const {active, have, show, mouseOver, data, selectData, disabled} = this.state;
        const {placeholder, displayName, displayValue, label, multiple} = this.props;
        let valueHtml = '';
        let menuHtml = '';
        if (multiple) {
            let valueHtml1 =  selectData.map((item, index) => {
                return (
                    <span
                        key={index}
                        className="le_select_selections_textList">
                        <span>{item[displayName]}</span>
                    </span>
                )
            });
            valueHtml = <div
                className="le_select_selections_text"
            >{valueHtml1}</div>

            if (selectData.length) {
                menuHtml = data.map((item, index) => {
                    let bool = false;
                    for (let i = 0 ; i < selectData.length; i++) {
                        if (selectData[i][displayValue] == item[displayValue]) {
                           bool = true
                        }
                    }
                    return (
                        <div
                            className={`le_select_menu_item ${bool ? 'active' : ''}`}
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
            } else {
                let value = selectData.length ? selectData[0][displayValue] : '';
                menuHtml = data.map((item, index) => {
                    return (
                        <div
                            className={`le_select_menu_item ${value == item[displayValue] ? 'active' : ''}`}
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
            }


        } else {
            let value = selectData.length ? selectData[0][displayValue] : '';
            let name = selectData.length ? selectData[0][displayName] : '';
            valueHtml =  <div
                className="le_select_selections_text"
            >{name}</div>;

            menuHtml = data.map((item, index) => {
                return (
                    <div
                        className={`le_select_menu_item ${value == item[displayValue] ? 'active' : ''}`}
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
                        {valueHtml}
                        <input
                            placeholder={(active && !selectData.length) ?  placeholder : ''}
                            id={'select_' + this._idSeed}
                            readOnly="readonly"
                            type="text"
                            autoComplete="off" />
                    </div>
                    {mouseOver ? this.getClearIconBox() : this.getSelectIconBox()}
                </div>
                <div
                    className={`le_select_menu ${show ? 'show' : 'hide'}`}
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
        )
    }
}

export default LeSelect