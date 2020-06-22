import React from 'react'
import { LeInput } from "./out"

 export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            value1: ''
        }
    }

    changeHandler(event) {
        this.setState({
            value:  event.target.value || ''
        })
    }

     changeHandler1(event) {
         this.setState({
             value1:  event.target.value || ''
         })
     }

     buttonClick() {
        console.log(this.state.value)
     }

    render() {
        return (
            <div>
                <LeInput
                    label='测试'
                    value={this.state.value}
                    onChange={this.changeHandler.bind(this)}
                    placeholder='23414234'
                    tips={'1112314'}
                    errorMsg={'14235'}
                />
                <LeInput
                    label='测试22222'
                    value={this.state.value1}
                    onChange={this.changeHandler1.bind(this)}
                    placeholder='23414234'
                    tips={'1112314'}
                    errorMsg={'14235'}
                />
                <input type="button" onClick={this.buttonClick.bind(this)}/>
            </div>
        );
    }
}