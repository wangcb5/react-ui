import React, {Component} from 'react'
import Alert from "@comp/alert";

function topComp(WrappedComponent) {
    return class TopComp extends Component{
        constructor(props) {
            super(props);

            this.alertRef = React.createRef();
        }

        render() {
            return <div>
                <WrappedComponent Alert={this.alertRef}  {...this.props}></WrappedComponent>
                <Alert ref={this.alertRef}/>
            </div>;
        }
    }
}

export default topComp