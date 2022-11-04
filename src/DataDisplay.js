import React from "react";
import RegisterDisplay from "./DataDisplayContainer/RegisterDisplay.js"
import MemoryDisplay from "./DataDisplayContainer/MemoryDisplay.js"
import DataSegment from "./DataDisplayContainer/DataSegment.js"
import Center from 'react-center';

/*
  This class holds arrays that students input into the SVM before
  they compile.

  These get allocated at the bottom of the stack addr[0], and move up,
  taking 4 bits each.


*/
export default class DataDisplay extends React.Component {
  constructor(props){
    super(props)
    console.log(props);

    this.state={
      opRegs : this.props.opRegs,
      utilRegs : this.props.utilRegs,
      memoryOps : this.props.memoryOps,

    }
  }
  render(){
    return(
      <div id="parent">

        <div>
            <DataSegment
              value = {this.props.dataString}
              clearDataArray = {this.props.clearDataArray}
              updateDataArray={this.props.updateDataArray}
            />
        </div>
        <div id="Registers">
        <Center>
          <h3> Registers </h3>
        </Center>
        <Center>

          <RegisterDisplay utilRegs={this.props.utilRegs} memoryOps={this.props.memoryOps} opRegs={this.props.opRegs} />

        </Center>
        </div>

        <div>
              <MemoryDisplay
                  memoryOps={this.props.memoryOps}
                  updateInputMem = {this.props.updateInputMem}
              />
        </div>

      </div>
    )
  }
}

/*
<div>
    <SystemMessage
    />
</div>

*/
