import React from 'react'
import {
    LeInput,
    LeButton,
    LeCheckbox,
    LeRadio,
    LeSelect
} from "./out"

 export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.checkboxRef = React.createRef();
        this.radioRef = React.createRef();
        this.selectRef = React.createRef();
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
                        label={'测试啊'}
                        multiple={true}
                    />
                </div>
            </div>
        );
    }
}