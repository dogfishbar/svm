import React from "react";
export default class Register extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name : this.props.name,
      value : this.props.value,
      width : this.props.width,
    }

  }
  // Use CSS to get the width going.

  render(){
    return(
      <div>
        <center>
           <h3>
            System Message
           </h3>
         </center>
      </div>


    )
  }
}
