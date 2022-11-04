import React from "react";
import '../App.css';
import { ButtonToolbar, Grid, Row, Col , Button} from "react-bootstrap";
import Center from 'react-center';
import FileUploadButton from "./FileUploadButton.js"

// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider'

// To include the default styles
import 'react-rangeslider/lib/index.css'

export default class ControlConsole extends React.Component {

  constructor(props){
    super(props);
    this.state={
      seconds : this.props.timer,
    }

  }

  handleChange(e){

  }

  onIncrement =(value) =>{
    this.props.timerChange(value);
  }
  onPlay =(value)=> {
    this.props.playCode();
  }

  onStop(){

  }

  onStep(){

  }

  render(){
    return(
    <div>

    <Grid>


       <Row className="show-grid">
         <Center>
       <Center>
            <ButtonToolbar>
               <Button onClick={this.onPlay.bind(this)} bsSize="medium" bsStyle="success">Play</Button>
               <Button onClick={this.props.stopCode} bsSize="medium" bsStyle="primary">Stop</Button>
               <Button onClick={this.props.stepCode} bsSize="medium" bsStyle="danger">Step</Button>
           </ButtonToolbar>
          </Center>

      </Center>
       </Row>
       <p>
       </p>
        <Center>
          <ButtonToolbar>
            <Button onClick={this.props.compileCode} bsStyle="success" bsSize="medium">Assemble</Button>
            <Button onClick={this.props.fullReset} bsStyle="info" bsSize="medium">Reset</Button>
          </ButtonToolbar>
         </Center>

       <Row className="show-grid">
        <Center>
          <Col xs={2} md={2}>

            <Slider
                min={1}
                max={10}
                value={this.props.timer}
                orientation="horizontal"
                onChange={this.onIncrement}
             > {/* TODO Set the width for this*/}
             </Slider>
         </Col>
         </Center>
        </Row>
        <Row className="show-grid">

        <Center>
          <FileUploadButton
            changeNoti={this.props.changeNoti}
            fileArray={this.props.fileArray}
            setFiles={this.props.setFiles}
          />
        </Center>
        </Row>
     </Grid>
    </div>
    )
  }
}
