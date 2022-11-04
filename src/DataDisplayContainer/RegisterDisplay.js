import React from "react";
import RegisterCol from "./RegisterCol.js"


export default class RegisterDisplay extends React.Component {

  constructor(props){
    super(props);
    this.state={
      utilRegs : this.props.utilRegs,
      opRegs : this.props.opRegs,
    }
  }

  setRegisters(registers){
    this.setState({registers});
  }

  render(){
    return(
      <div className="regDisplay">
        <div className="left">
            <RegisterCol registers={this.state.utilRegs} />
        </div>
        <div className="left">
          <RegisterCol registers={this.state.opRegs} />
        </div>
      </div>
    )
  }
}
