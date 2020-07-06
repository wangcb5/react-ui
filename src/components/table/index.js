import './index.scss'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Ajax from '@core/fetch'
import LeTableHeader from './header'
import LeTableBody from "@comp/table/body";
import LeTableFooter from "@comp/table/footer";

class LeTable extends Component{
    static propTypes = {
        options : PropTypes.object,
    };
    static defaultProps = {
        options: {}
    };
    constructor(props) {
        super(props);

        this.state = {
            pageNow: props.options.pageOption.index,//当前多少页
            pageSize: props.options.pageOption.size,//一页多少条
            pageCount: 0, //多少页
            pageLength: 0, //多少条
            data: []
        }
        this.renderBool = false;
    }
    /************ 生命周期 start *******************/
    componentDidMount() {
        this.init();
    }
    /************ 生命周期 end *******************/

    /************ method start *******************/
    init() {
        this.tableOptionsHandler(this.props.options)
    }
    tableOptionsHandler(options){
        const url = options.getUrl();
        if (!url) return;
        this.renderBool = false;
        Ajax.getFetch(url + `&${options.pageOption.sizeKey}=${options.pageOption.size}&${options.pageOption.indexKey}=${options.pageOption.index}`, true).then(data=> {
            let result = options.analysis(data).data;
            let resultData = result.data;
            for (let i = 0 ; i < resultData.length; i++) {
                resultData[i]._ck =  false
            }
            this.renderBool = true;
            this.setState({
                pageSize: result[options.pageOption.sizeKey],
                pageNow: result[options.pageOption.indexKey],
                pageCount: result[options.pageOption.countKey],
                pageLength: result[options.pageOption.lengthKey],
                data: resultData
            })
        }).catch(err => {
            options.analysis(err);
            this.renderBool = true;
        })
    }
    getCheckedItem=()=>{
        return this.state.data.filter(item => {
            return item._ck === true
        })
    };
    checkedItemHandler=(index, flag)=> {
        let resultData = this.state.data;
        if (this.props.options.singleSelected) {
            for (let i = 0 ; i < resultData.length; i++) {
                resultData[i]._ck = false
            }
        }
        resultData[index]._ck = flag;
        this.setState({
            data: resultData
        })
    };
    checkedAllHandler=(flag)=> {
        let resultData = this.state.data;
        for (let i = 0 ; i < resultData.length; i++) {
            resultData[i]._ck = flag
        }
        this.setState({
            data: resultData
        })
    };
    /************ method start *******************/

    /************ event start *******************/
    onPageSizeChange=(value)=> {
        let options = this.props.options;
        options.pageOption.index = 1;
        options.pageOption.size = value;
        this.tableOptionsHandler(options);
    };
    onPageNowChange=(value)=>{
        let options = this.props.options;
        options.pageOption.index = value;
        this.tableOptionsHandler(options);
    };
    /************ event end *******************/
    render() {
        if (!this.renderBool) return null;
        const {pageSize, pageNow, pageCount, pageLength, data} = this.state;
        const {options} = this.props;
        let bodyFooter = null;
        if (data.length){
            bodyFooter =  <LeTableFooter
                pageNow={pageNow}
                pageSize={pageSize}
                pageCount={pageCount}
                pageLength={pageLength}
                onPageSizeChange={this.onPageSizeChange}
                onPageNowChange={this.onPageNowChange}
            />
        };
        return (
            <div>
                <table className={'le_table'}>
                    <LeTableHeader
                        options={options}
                        data={data}
                        onCheckedAllHandler={this.checkedAllHandler}
                    />
                    <LeTableBody
                        data={data}
                        options={options}
                        onCheckckedItemHandler={this.checkedItemHandler}
                    />
                </table>
                {bodyFooter}
            </div>
        );
    }
}

export default LeTable