import React, {Component} from 'react'
import PropTypes from 'prop-types'
import LeButton from "@comp/button";

class LeTableBody extends Component{
    static propTypes = {
        data: PropTypes.array,
        options: PropTypes.object,
        onCheckckedItemHandler: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {

        }
    }
    /*********** method start **************/
    onCheckckedItemHandler=(index, flag)=> {
        if (!flag && this.props.options.singleSelected) return;
        this.props.onCheckckedItemHandler(index, flag)
    };
    getTableBodyList() {
        const {showCk,singleSelected, map, actions} = this.props.options;
        const {data} = this.props;
        if (!data.length) {
            return <tr ><td colSpan={map.length} style={{textAlign: 'center'}}>暂无数据</td></tr>
        }
        let resultArr = [];
        for (let i = 0 ; i < data.length; i++) {
            let tdHtml = map.map((item, index) => {
                    return <td key={index + 2}>{data[i][item.key] ? item.convert ? item.convert(item, data[i]) : data[i][item.key] : ''}</td>
            });
            let checkboxHtml = null;
            let btnHtml = null;
            if (showCk && singleSelected) {
                checkboxHtml = <td key={0}>
                    <div className="le_table_header_item_checkbox">
                        <i
                            className={`fa ${data[i]._ck ? 'fa-check-circle' : 'fa-circle-o'}`}
                            onClick={() =>this.onCheckckedItemHandler(i, !data[i]._ck)}
                        ></i>
                    </div>
                </td>
            } else if(showCk){
                checkboxHtml = <td key={0}>
                    <div className="le_table_header_item_checkbox">
                        <i
                            className={`fa ${data[i]._ck ? 'fa-check-square checked' : 'fa-square-o'}`}
                            onClick={() =>this.onCheckckedItemHandler(i, !data[i]._ck)}
                        ></i>
                    </div>
                </td>
            }
            if (actions.length) {
                let btnList = actions.map((items, indexs) => {
                    return <LeButton key={indexs}  value={items.val} onClick={() =>items.action(data[i])}/>

                });
                btnHtml = (<td key={1}><div className={'le_table_header_item_btnList'}>{btnList}</div></td>)
            }

            let trHtml = <tr key={i}>{checkboxHtml}{btnHtml}{tdHtml}</tr>;
            resultArr.push(trHtml)
        }
        return resultArr
    }
    /*********** method end  **************/

    /*********** 生命周期 start **************/
    /*********** 生命周期 end  **************/

    /*********** event start **************/
    /*********** event end  **************/

    render() {
        const bodyHtml = this.getTableBodyList();
        return (
            <tbody className={'le_table_body'}>
                    {bodyHtml}
            </tbody>
        );
    }

}

export default LeTableBody
