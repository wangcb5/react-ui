import React, {Component} from 'react'
import LeSelect from "@comp/select";
import PropTypes from 'prop-types'

class LeTableFooter extends Component{
    static propTypes = {
        pageSize: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        pageNow: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        pageLength: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        pageCount: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        onPageSizeChange: PropTypes.func,
        onPageNowChange: PropTypes.func
    };
    static defaultProps = {
        pageSize:  0,
        pageNow: 0,
        pageLength: 0,
        pageCount: 0
    };
    constructor(props) {
        super(props);

        this.pageSizeRef = React.createRef();
        this.state = {
            pageSizeList: [],//页select
        }
    }
    /********** method start ******************/
    init() {
       this.getPageSizeList(this.props);
    }
    getPageSizeList(props) {
        let pageSizeList = [];
        //设置select
        const {pageSize,pageLength} = props;
        if (pageSize && pageLength) {
            const length = pageLength > 20 ? 20 : pageLength < 10 ? 10 : pageLength;
            for (let i = 0 ; i < Math.ceil(length/5); i++) {
                pageSizeList.push({
                    name: (i+1)*5,
                    code: (i+1)*5
                })
            }
        }
        if (pageSizeList.length > 0) {
            this.setState({
                pageSizeList
            }, () => {
                let setValueObj = pageSizeList.filter(item => {
                    return item.code == pageSize
                })[0];
                this.pageSizeRef.current.setValue(setValueObj)
            })
        }
    }
    /********** method end ******************/
    /********** 生命周期 start ******************/
    componentWillReceiveProps(nextProps) {
        const {pageLength} = this.props;
        if (pageLength != nextProps.pageLength) {
            this.getPageSizeList(nextProps)
        }
    }
    componentDidMount() {
        this.init()
    }
    /********** 生命周期 end ******************/

    /*************** event start   ************************/
    onPageSizeChange=(value)=> {
        this.props.onPageSizeChange && this.props.onPageSizeChange(value);
    };
    onPageNowChange=(value)=> {
        this.props.onPageNowChange && this.props.onPageNowChange(value)
    };
    onPageLeftChange=()=>{
        const {pageNow} = this.props;
        if (pageNow <= 1) return;
        let pageChangeNow = pageNow -1;
        this.onPageNowChange(pageChangeNow)
    };
    onPageRightChange=()=>{
        const {pageCount, pageNow} = this.props;
        if (pageCount < 1 || pageNow >= pageCount) return;
        let pageChangeNow = pageNow + 1;
        this.onPageNowChange(pageChangeNow)
    };
    /**************** event end   ***********************/
    render() {
        const {pageSizeList} = this.state;
        const {pageSize, pageCount,pageNow,pageLength} = this.props;

        return (
            <div className="le_table_footer">
                    <div className="le_table_footer_select">Rows per page:
                    <div className={'le_table_footer_select_content'}>
                        <LeSelect
                            data={pageSizeList}
                            displayName={'name'}
                            displayValue={'code'}
                            disabled={false}
                            ref={this.pageSizeRef}
                            onChange={this.onPageSizeChange}
                        />
                    </div>
                </div>
                <div className={'le_table_footer_pagination'}>{((pageNow -1) * pageSize) + 1}-{pageNow * pageSize < pageLength ? pageNow * pageSize : pageLength} of {pageLength}</div>
                <div className={'le_table_footer_icon_before'}>
                   <i
                       className={`fa fa-angle-left ${pageNow > 1 ? '' : 'disabled'}`}
                       onClick={this.onPageLeftChange}
                   />
                </div>
                <div className={'le_table_footer_icon_after'}>
                   <i
                       className={`fa fa-angle-right ${pageCount > 1 && pageNow < pageCount ? '' : 'disabled'}`}
                       onClick={this.onPageRightChange}
                   />
                </div>
            </div>
        );
    }
}

export default LeTableFooter