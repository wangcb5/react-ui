import tool from '@core/tool'
import React, {Component} from 'react'
import './index.scss'
import PropTypes from 'prop-types'

class LeRadio extends Component{
    static propTypes = {
        onChange: PropTypes.func,
        data: PropTypes.array,
        disabled: PropTypes.bool,
        displayName: PropTypes.string,
        displayValue: PropTypes.string,
        name: PropTypes.string
    };
    static defaultProps = {
        data: [],
        disabled: false,
        displayName: 'name',
        displayValue: 'code',
        name: 'radio'
    };
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data ? this.props.data: []
        }
    }

    /*********  生命周期 start   *************/
    componentWillMount() {
        this.init();
    }
    /*********  生命周期 end   *************/

    /*********  method start   *************/
    init() {
        if (!this.state.data) return;
        let dataArr = tool.object.cloneObj(this.state.data);
        for (let i = 0 ;i< dataArr.length; i++) {
            dataArr[i]['_cls'] = '';
            dataArr[i]['_ck'] = false;
            dataArr[i]['_id'] = tool._idSeed.newId()
        }
        this.setState({
            data: dataArr
        })
    }
    getCheckedItems(){
        return this.state.data.filter(item => {
            return item._ck
        })
    }
    setCheckedItems(obj){
        const {displayValue} = this.props;
        if (obj[displayValue]) {
            let data = tool.object.cloneObj(this.state.data);
            for (let j = 0; j < data.length; j++) {
                    if (obj[displayValue] == data[j][displayValue]) {
                        data[j]._ck = true
                    }
            }
            this.setState({
                data
            })
        }
    }
    getItemByField(obj){
        if (!obj) return this.state.data;
        return this.state.data.filter(item => {
            if (obj[this.props.displayName] && obj[this.props.displayValue]) {
                return (obj[this.props.displayName] == item[this.props.displayName]) && (obj[this.props.displayValue] == item[this.props.displayValue])
            }else if (obj[this.props.displayName]) {
                return obj[this.props.displayName] == item[this.props.displayName]
            }else if (obj[this.props.displayValue]) {
                return obj[this.props.displayValue] == item[this.props.displayValue]
            }else{
                return true
            }
        })
    }
    /*********  method end   *************/

    /*********  event start   *************/
    onChange=(e, index)=> {
        let dataArr = this.state.data;
        if (dataArr[index]._ck) return;
        for (let i = 0 ; i < dataArr.length; i++) {
            dataArr[i]._ck = false
        }
        dataArr[index]._ck = true;
        this.setState({
            checked: dataArr
        });
        this.props.onChange && this.props.onChange(e)
    }
    /*********  event end   *************/

    render() {
        const {displayName, displayValue, name, disabled} = this.props;
        let html = this.state.data.map((item, index) => {
            return (
                <li key={index} className='le_radio_item'>
                    <div className={'le_radio_item_icon'}>
                        <i
                            className={`fa ${item._ck ? 'fa-check-circle' : disabled? 'fa-ban' : 'fa-circle-o'}`}
                            aria-hidden="true"
                            style={{
                                color: disabled ? '' : '#1867c0',
                                fontSize: 20,
                            }}
                        ></i>
                        <input type="radio"
                               style={{cursor: disabled? 'auto' : 'pointer'}}
                               id={item._id}
                               value={item[displayValue]}
                               disabled={disabled}
                               checked={item._ck}
                               name={name}
                               onChange={ (e) => this.onChange(e, index)}
                        />
                    </div>
                    <div className={'le_radio_item_label'}>
                        {item[displayName]}
                    </div>
                </li>
            )
        })
        return (
            <ul className="le_radio_box clearfix">
                {html}
            </ul>
        )
    }
}

export default LeRadio