import React from "react";


export default class DataRow extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return(
      <h4>
        <label className="instruction">
        {this.props.address} &nbsp; :  &nbsp;   {this.props.value}
        </label>
      </h4>
    )
  }
}
