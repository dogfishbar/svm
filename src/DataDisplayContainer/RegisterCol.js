import React from "react";

import Register from "./Register.js"

export default class RegisterCol extends React.Component {

  constructor(props){
    super(props);
    this.state={
      registers : this.props.registers,
    }
  }

  setRegisters(registers){
    this.setState({registers});
  }

  render(){
    return(
      <div>
        {this.state.registers.map((register, index) => (
          <center>
          <Register
              key={index}
              name={register.name}
              value={register.value}
              width="200px"
            />
        </center>
        ))}
      </div>
    )
  }
}
