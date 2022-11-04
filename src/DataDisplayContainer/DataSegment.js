import React from "react";
import {  FormGroup, FormControl, ControlLabel, HelpBlock} from "react-bootstrap";

const badInput="Only commas and numbers can be input to DataSegment"
const badNumber = "One of the numbers is invalid. Make sure all negative signs are leading."
const goodInput="Example input is : 34, 43, 72 "

export default class Register extends React.Component {


  constructor(props){
    super(props);

    this.state={
      //dataArray : this.props.dataArray,
      value: this.props.value,
      feedback: goodInput,
    }
  }


  handleChange(e) {
    let str=e.target.value;
    var isValid=/^[-0-9, ]*$/.test(str);


    if(isValid){
      let newStr=str.replace(/\s+/g,"");
      let numbers=newStr.replace(/(\r\n|\n|\r|)/gm,"");
      let data=numbers.split(",")
      let badNumPres = false;

      this.props.clearDataArray();

      for (var i=0; i < data.length; i++){
        if(isNaN(data[i])){
          this.setState({
            feedback: badNumber
          });

          badNumPres = true;
        }else{
          console.log(str);
          if(str.length > 0){
            this.props.updateDataArray(i*2, data[i], str);
          }
        }
      }

      console.log(this.props.dataArray);
      if(!badNumPres){
          this.setState({
                          feedback: goodInput
                          });
          }
    }
    else{
      this.setState({
                    feedback: badInput
                    });
    }

  }

  render(){


    return(
    <FormGroup
      controlId="formBasicText"

    >
      <center>
        <ControlLabel> Data Segment </ControlLabel>
      </center>
      <FormControl
        type="text"
        value={this.props.value}
        placeholder="Enter numbers separated by commas"
        onChange={this.handleChange.bind(this)}
      />
      <FormControl.Feedback />
      <center>
        <HelpBlock>{this.state.feedback}</HelpBlock>
      </center>
    </FormGroup>


    )
  }
}
