import React from 'react'
import {
    LeInput,
    LeButton,
    LeCheckbox,
    LeRadio,
    LeSelect,
    AutoCompleted,
    LeTable,
    LeUpload,
} from "./out"
import proxy from "@core/proxy";
import tool from '@core/tool'
import topComp from '@comp/topComp.js'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.checkboxRef = React.createRef();
        this.radioRef = React.createRef();
        this.selectRef = React.createRef();
        this.selectRef1 = React.createRef();
        this.tableRef = React.createRef();
        this.state = {
            value: '123',
            value1: '',
            data: [
                {
                    name: '测试1',
                    code: 1
                },
                {
                    name: '测试2',
                    code: 2
                },
                {
                    name: '测试3',
                    code: 3
                },
                {
                    name: '测试4',
                    code: 4
                },
                {
                    name: '测试5',
                    code: 5
                },
            ]
        };
    }
    componentDidMount() {
        this.checkboxRef.current.setCheckedItems([{
            name: '测试1',
            code: '1'
        }
        ]);
        this.radioRef.current.setCheckedItems({
            name: '测试1',
            code: '1'
        });
        this.selectRef.current.setValue({
            name: '测试1',
            code: '1'
        })
    }

     /*********  input start ***********/
    changeHandler=(event)=> {
        let name = event.target.name;
        this.setState({
            [name]:  event.target.value || ''
        })
    }
     /*********  input end ***********/

    /*********  button start ***********/
    buttonClickHandler=()=>{
        console.log(this.state.value)
    }
    buttonSubmitHandler=()=> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(111)
            },1000)
        })
    }
     /*********  button end ***********/

     autoCompletedHandler=(data)=>{
         console.log(data);
         return data
     }
     getCheckedItem=()=>{
         let item = this.tableRef.current.getCheckedItem();
         console.log(item)

     }

     formatTime(item,row){
         // time转换
         return tool.date.dateTime(row[item.key]);
     }
     infoBtn(row){
         console.log(row)
     }

     uploadAnalysis(data) {
         return data.data
     }

     alertHandler=()=> {
         this.props.Alert.current.showAlert('123')
     };

    render() {
        return (
            <div>
                input组件:
                <br />
                <LeInput
                    label='测试'
                    value={this.state.value}
                    name="value"
                    onChange={this.changeHandler}
                    placeholder='23414234'
                    tips={'1112314'}
                    errorMsg={'14235'}
                    style={{'width': 200}}
                />
                <LeInput
                    label='测试2'
                    value={this.state.value1}
                    name="value1"
                    onChange={this.changeHandler}
                    placeholder='23414234'
                    tips={'1112314'}
                    errorMsg={'14235'}
                />
                button组件：
                <div>
                    <LeButton
                            type="default"
                            tag='button'
                            value='button'
                            disabled={false}
                            onClick={this.buttonClickHandler}
                            onSubmit={this.buttonSubmitHandler}
                            iconName={'fa-align-justify'}
                            style={{marginRight: 10}}
                    />
                    <LeButton
                        type="default"
                        tag='submit'
                        value='submit'
                        disabled={false}
                        onClick={this.buttonClickHandler}
                        onSubmit={this.buttonSubmitHandler}
                        iconName={'fa-align-justify'}
                    />
                </div>
                <br />
                checkbox组件：
                <LeCheckbox
                    data={this.state.data}
                    disabled={false}
                    displayName={'name'}
                    displayValue={'code'}
                    ref={this.checkboxRef}
                />
                <br/>
                radio组件：
                <LeRadio
                    name={'radio'}
                    data={this.state.data}
                    disabled={true}
                    displayName={'name'}
                    displayValue={'code'}
                    ref={this.radioRef}
                />
                <br/>
                select组件：
                <br/>
                <div style={{width: 300}}>
                    <LeSelect
                        data={this.state.data}
                        displayName={'name'}
                        displayValue={'code'}
                        disabled={false}
                        ref={this.selectRef}
                        label={'测试啊1'}
                        multiple={true}
                        clear={true}
                    />
                    <LeSelect
                        data={this.state.data}
                        displayName={'name'}
                        displayValue={'code'}
                        disabled={false}
                        ref={this.selectRef1}
                        label={'测试啊2'}
                        multiple={false}
                    />
                </div>
                AutoCompleted:
                <AutoCompleted
                    displayName={'word'}
                    displayValue={'appId'}
                    disabled={false}
                    label={'测试'}
                    url={'/auto/suggest?keyword='}
                    multiple={false}
                    analysis={this.autoCompletedHandler}
                />
                <br/>
                table:
                <LeButton
                    value='获取选中项'
                    onClick={this.getCheckedItem}
                />
                <LeTable
                    ref={this.tableRef}
                    options={{
                        showCk:true,
                        // singleSelected: true,
                        map:[
                            {key:"materialNumber",val:"<#物料编码#>"},
                            {key:"messageID",val:"<#消息ID#>"},
                            {key:"message",val:"<#消息内容#>"},
                            {key:"updateTime",val:"<#更新时间#>", convert:this.formatTime}
                        ],
                        getUrl:() => {
                            return proxy.proxyUrl + "/index/queryList/179?materialNumber="
                        },
                        pageOption:{
                            sizeKey:"pageSize",
                            indexKey:"currentPage",
                            countKey: 'totalPage',
                            lengthKey: 'totalNum',
                            index:1,
                            size:10
                        },
                        actions:[
                            {
                                key:"btn",
                                val:"<#按钮#>",
                                action:this.infoBtn
                            }
                        ],
                        analysis:(data)=>{
                            if(data && data.data && data.data.data){
                                return {
                                    data: data.data
                                }
                            }else{
                                return {
                                    data:[]
                                }
                            }
                        }
                    }}
                />
                <br />
                upload:
                <LeUpload
                    label={'upload测试'}
                    analysis={this.uploadAnalysis}
                    url={'file/img/upload'}
                    keyname={'file'}
                    multiple={true}
                    disabled={false}
                />
                <br/>
                alert:
                <LeButton
                    value='alert测试'
                    onClick={this.alertHandler}
                />
            </div>
        );
    }
}

export default topComp(App)