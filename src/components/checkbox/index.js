import tool from '@core/tool'
import React from 'react'
import './index.scss'
import PropTypes from 'prop-types'

class LeCheckbox extends React.Component{
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
    setCheckedItems(array){
        const {displayValue} = this.props;
        if (array && array.length > 0) {
            const arr = array.map(item => {
                return item[displayValue]
            });
            let data = tool.object.cloneObj(this.state.data);
            for (let j = 0; j < data.length; j++) {
                for (let i = 0 ; i < arr.length; i++) {
                    if (arr[i] == data[j][displayValue]) {
                        data[j]._ck = true
                    }
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
        dataArr[index]._ck = !dataArr[index]._ck;
        this.setState({
            checked: dataArr
        });
        this.props.onChange && this.props.onChange(e)
    }
    /*********  event end   *************/

    render() {
        const {displayName, displayValue} = this.props;
        let html = this.state.data.map((item, index) => {
            return (
                <li key={index} className='le_checkbox_item'>
                    <div className={'le_checkbox_item_icon'}>
                        <i
                            className={`fa ${item._ck ? 'fa-check-square' : 'fa-square-o'}`}
                            aria-hidden="true"
                            style={{
                               color: '#1867c0',
                                fontSize: item._ck ? 20 : 22,
                            }}
                        ></i>
                        <input type="checkbox"
                               id={item._id}
                               value={item[displayValue]}
                               checked={item._ck}
                               onChange={ (e) => this.onChange(e, index)}
                        />
                    </div>
                    <div className={'le_checkbox_item_label'}>
                        {item[displayName]}
                    </div>
                </li>
            )
        })
        return (
            <ul className="le_checkbox_box clearfix">
                {html}
            </ul>
        )
    }
}

LeCheckbox.defaultProps = {
    data: [],
    disabled: false,
    displayName: 'name',
    displayValue: 'code'
}

LeCheckbox.propTypes = {
    onChange: PropTypes.func,
    data: PropTypes.array,
    disabled: PropTypes.bool,
    displayName: PropTypes.string,
    displayValue: PropTypes.string
}

export default LeCheckbox