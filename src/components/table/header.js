import React, {Component} from 'react'
import PropTypes from 'prop-types'

class LeTableHeader extends Component{
    static propTypes = {
        options: PropTypes.object,
        data: PropTypes.array,
        onCheckedAllHandler: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {

        }
    }
    /************ method start ***************/
    getTableHeaderList(arr) {
        const {showCk,singleSelected,actions} = this.props.options;
        const {data} = this.props;
        let AllChecked = true;
        for (let i = 0 ; i < data.length; i++) {
            if (!data[i]._ck) {
                AllChecked = false
            }
        }
        let resultArr = [];
        if (showCk && singleSelected) {
            resultArr.push(<th key={0}><span></span></th>)
        } else if (showCk && data.length){
            resultArr.push(<th key={0}>
                <div className="le_table_header_item_checkbox">
                    <i className={`fa ${AllChecked ? 'fa-check-square checked' : 'fa-square-o'}`} onClick={() => this.props.onCheckedAllHandler(!AllChecked)}></i>
                </div>
            </th>)
        }
        if (actions.length) {
            resultArr.push(<th key={1}><span>操作</span></th>)
        }
        return resultArr.concat(arr.map((item, index) => {
            return <th key={index+2}>
                <span>{item.val}</span>
            </th>
        }))
    }
    /************ method end  ***************/


    render() {
        const {map} = this.props.options;
        if (!map.length) return null;
        const headerListHtml = this.getTableHeaderList(map);
        return (
            <thead className="le_table_header">
            <tr>
                {headerListHtml}
            </tr>
            </thead>
        )
    }
}

export default LeTableHeader

