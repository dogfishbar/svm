import React, { Component } from 'react';
// import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/journal/bootstrap.css";
import { Grid, Row, Col } from "react-bootstrap";
import CodeDisplay from "./CodeDisplay.js";
import AssemblyLanguageInstructions from "./AssemblyLanguageInstructions.js";
import DataDisplay from "./DataDisplay.js";
import Header from "./Header.js";
import brace from 'brace';

import 'brace/mode/java';
import 'brace/theme/github';

let successfulAssembley = "Assembley Successful";

let OP_REGS = [
  // May have to explicitly declare these as registers.
  { name: "R0", value: 0 },
  { name: "R1", value: 0 },
  { name: "R2", value: 0 },
  { name: "R3", value: 0 }
];

let UTIL_REGS = [
  { name: "PC",   value: 1 }, // Holds the address in RAM of the next
                              // instruction to be executed
  { name: "PSW",  value: 0 }, // The program status word holds the
                              // outcome of comparisons, etc
  { name: "RA",   value: 1 }, // The return address register holds the address
                              // of the instruction to return to after a JSR.
  { name: "Zero", value: 0 }  // The Zero register holds the constant 0.
];

let MEMORY_OPS = [];
let MEMORY = new Map();
let inputMem = new Map();
let dataValStr = "";

var InstrTypes = {
  NONE:         "X",
  REGISTER:     "R",
  IMMTRANSFER:  "TI",
  REGTRANSFER:  "TR",
  MEMORY:       "M",
  BRANCH:       "B",
  EMPTY:        "E",
  COMPARE:      "C",
  JUMP:         "J"
};

let compiledCode = [];
let instructions = [];
let armInstrs = new AssemblyLanguageInstructions({ utilRegs: UTIL_REGS,
                                                   memory: MEMORY,
                                                   memOps: MEMORY_OPS
                                                 });
var ace = require('brace');
var Range = ace.acequire('ace/range').Range

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      codeDisplayWidth: window.innerWidth / 2,
      notification : "",
      notificationColor : null,
      setNotification: this.setNotification.bind(this),
      code : "",
      operationRegs : OP_REGS,
      utilRegs  : UTIL_REGS,
      memoryOps : MEMORY_OPS,
      memory    : MEMORY,
      inputMem  : inputMem,
      currLine  : 0,
      pause     : false,
      timer : 3,
      secondsElapsed : 0,
    }
  }

  testMethod(e){
    console.log("TEST");
    console.log(e);
  }

  render() {
    //console.log(this.state.dataValStr);
      return (
        <div className="papaBear">
        <div >
          <Header/>
        </div>
              <Grid>
                <Row>
                  <Col md={8} sm={8} lg={8}>
                    <CodeDisplay ref = "codeDisp"
                                 width={this.state.codeDisplayWidth +"px"}
                                 timer={this.state.timer}
                                 timerChange={this.setTimer.bind(this)}
                                 compileCode={this.compileCode.bind(this)}
                                 testRun={this.playCode.bind(this)}
                                 changeCode={this.handleChange.bind(this)}
                                 changeNoti={this.setNotification.bind(this)}
                                 playCode={this.playCode.bind(this)}
                                 stopCode={this.setPause.bind(this)}
                                 stepCode={this.step.bind(this)}
                                 code={this.state.code}
                                 fullReset = {this.fullReset.bind(this)}
                                 notification={this.state.notification}
                                 notiColor={this.state.notificationColor}
                                 selectedLine = {UTIL_REGS[0].value}
                                />
                  </Col>
                  <Col md={4} sm={4} lg={4}>
                    <DataDisplay
                        opRegs={this.state.operationRegs}
                        utilRegs={this.state.utilRegs}
                        dataString = {this.state.dataValStr}
                        clearDataArray = {this.memoryWipe.bind(this)}
                        memoryOps = {this.state.memory}
                        updateInputMem = {this.updateInputMem.bind(this)}
                        updateDataArray={this.updateMemory.bind(this)}  //Method that gets passed into the updateDataArray so the compiler knows what is input.
                    />
                  </Col>
                </Row>
              </Grid>
      </div>
      );
    }

  updateMemory(loc, val, str) {
    inputMem.set(loc, val);
    MEMORY.set(loc,val);
    this.setState({dataValStr: str, inputMem: inputMem, memory: MEMORY});
  }

  updateDimensions() { this.setState({width: (window.innerWidth/2)}) }

  updateInputMem(inputMem) { this.setState({inputMem}) }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  handleChange(e) { this.setState({code: e}); }

  setNotification(notification) { this.setState({notification}); }

  setTimer(timer) { this.setState({timer}); }

  step(e) {
    this.setPause(e);
    this.executeLineOfCode();
  }

  setPause(pause) { clearInterval(this.incrementer); }

  playCode() {
    var home = this;
    if(home.state.secondsElapsed === 0) {
      this.executeLineOfCode();
    }
    this.incrementer = setInterval(function(){
      if (home.state.secondsElapsed === home.state.timer - 1) {
        home.executeLineOfCode();
      }
      home.setState({
        secondsElapsed: (home.state.secondsElapsed + 1) % home.state.timer
      });
    }, 1000);
  }

  selectAceLine(num){
    const editor = this.refs.codeDisp.refs.ace.editor;
    console.log(editor.session);
    editor.session.addDynamicMarker(new Range( 0, 0, 1,  1), "myMarker", "fullLine", true);
  }

  executeLineOfCode() {
        let PCVal = parseInt(UTIL_REGS[0].value);
        this.selectAceLine(PCVal);
        let loc = PCVal - 1;

        //TODO Possibly make this check after an instruction is exectued.
        if (loc >= instructions.length) {
          console.log("Time to break out!");
          this.setPause();
        }
        else {
          const instruct = instructions[loc];
          UTIL_REGS[0].value=(PCVal + 1);

        let instr  = instruct[0];

        let rdInfo = instruct[1];
        let rsInfo = instruct[2];
        let rtInfo = instruct[3];

        let immediateInfo = instruct[4];
        let offsetInfo    = instruct[5];
        let dispInfo      = instruct[6];

        let rs = null;
        let rd = null;
        let rt = null;
        let number = null;
        let offset = null;
        let disp = null;

        if (rsInfo !== null) {
          if (rsInfo.toUpperCase() === "ZERO")
            rs = UTIL_REGS[3];
          else
            rs = OP_REGS[parseInt(rsInfo.substr(-1))];
          }

        //IF Rd is Zero register notify the user that that is illegal
        if (rdInfo !== null) {
             rd = OP_REGS[parseInt(rdInfo.substr(-1))];
         }

        if (rtInfo !== null) {
          if (rtInfo.toUpperCase() === "ZERO"){
            rt = UTIL_REGS[3];
          } else {
            rt = OP_REGS[parseInt(rtInfo.substr(-1))];
          }
        }

        if (immediateInfo !== null) {
          number = parseInt(immediateInfo);
         }

        // Multiply by word size.
        if(offsetInfo !== null){
           offset = parseInt(offsetInfo) * 2;
         }

        if(dispInfo !== null){
           disp = parseInt(dispInfo);
        }

console.log("executeLineOfCode: about to execute something ...");
        armInstrs.executeInstruction(instr,  rd, rs, rt, number, offset, disp);
console.log("executeLineOfCode: just back from executing something ...");
           //Increment PC
        this.updateDataArray()

        console.log(MEMORY);
        this.setState({ utilRegs: UTIL_REGS,
                        memoryOps : MEMORY_OPS,
                        operationRegs : OP_REGS
                      });
    }
  }

  compileCode() {
      this.reset();
      this.setState({ operationRegs : OP_REGS,  // re-initialize the regs
                      code: this.state.code.replace(/\r/gm, '')
                    });

      let success = true;
      const home = this;

      instructions = []; // Reset instructions.

      let rawCode = this.state.code;

      rawCode = rawCode.toUpperCase()
                       .replace(/\d+:/g, '')  // optional label out
                       .replace(/;/g, '')     // get rid of spurious ;s
                       .replace(/\n/g, ';')   // replace \ns with ;s
                       .replace(/\s+/g, ' ')
                       .trim();

      console.log("compileCode: rawCode=" + rawCode);

      compiledCode = rawCode.split(";");

      // For some reason there is always an extra space character at the end.
      compiledCode.splice(-1, 1);

      // delete empty lines HEADS UP: may screw up PC!
      compiledCode = compiledCode.filter(i => i != '');

      for (var i=0; i < compiledCode.length; i++) {

        let e = compiledCode[i].trim();
        //if (e == '') break;

        e = e + " ";
        let op = "";
        op = e.substring(0, e.indexOf(" "));
console.log("e=" + e + " and op=" + op);
        //Get the Operation and determine if it's an R, I or J instruction.
        let opType = armInstrs.getOperationType(op);

        if(opType === InstrTypes.NONE){
            success = false;
            this.setNotification("Operation in line " + (i+1) + " is not found");
            setTimeout((function(){
              home.setNotification("")
            }), 3000);
            break;
        }
        else if (opType === InstrTypes.MEMORY) {

          let rd="";
          let offset="";
          let rs="";

          let regExists=false;
          e=e.replace(/\s+/g, '');
          e=e.toUpperCase();

          if(!e.includes(",")){
            success=false;
            this.setNotification("Forgot to include comma in instruction " + (i+1));
            setTimeout((function(){
              home.setNotification("")
            }), 3000);
            break;
          }

          rd=e.substring(e.indexOf("R"), e.indexOf(","));

          regExists=this.testForRegisterPresence(rd, false);

          if(!regExists /*The Value Register does not exist*/){

            if(rd === "Zero"){
              this.setNotification("Cannot use RZ as a Destination Register");
            }else{
              this.setNotification("Dest Register in instruction " + (i+1) + " does not exist");
            }
            success=false;
            setTimeout((function(){
              home.setNotification("")
            }), 3000);
            break;
          }

          e=e.substring(e.indexOf(",")+1, e.length);
          offset = e.substring(0, e.indexOf("("));

          e = e.substring(e.indexOf("(") + 1, e.length);
          rs = e.substring(0, e.indexOf(")"));

          regExists = this.testForRegisterPresence(rs, true);

          if(!regExists /*The Source Register does not exist*/){
            this.setNotification("Source Register in instruction " + (i+1) + " does not exist");
            success = false;
            setTimeout((function(){
              home.setNotification("")
            }), 3000);
            break;
          }
          e = e.substring(e.indexOf(" ") + 1, e.length);
          // Trim out all the spaces and new lines.
          e = e.trim();

          instructions.push([op, rd, rs,  null, null , offset, null]);

        }
        else if(opType === InstrTypes.IMMTRANSFER){
          /**
            Process a TI instruction
          */
          let rd = "";
          let number = "";
          let regExists = false;

          e = e.substring(e.indexOf(" ") + 1, e.length);
          rd = e.substring(0, e.indexOf(","));
          rd = rd.trim();

          regExists=this.testForRegisterPresence(rd, false);

          if(!regExists /*The Value Register does not exist*/){

            if(rd.substr(0) === "Z"){
              this.setNotification("Cannot use RZ as a Destination Register");
            }else{
              this.setNotification("Dest Register in instruction " + (i+1) + " does not exist");
            }

            success = false;
            setTimeout((function(){
              home.setNotification("")
            }), 3000);
            break;
          }

          e = e.substring(e.indexOf(" ")+1, e.length);
          number=e.substring(0, e.indexOf(" "));

          e=e.substring(e.indexOf(" ")+1, e.length);
          // Trim out all the spaces and new lines.
          e=e.trim();
          instructions.push([op, rd, null, null,  number , null, null]);


        }
        else if(opType === InstrTypes.REGTRANSFER){

          /**
            Process a TI instruction
          */

          let rd="";
          let rs="";

          let regExists=false;

          e=e.substring(e.indexOf(" ")+1, e.length);
          rd=e.substring(0, e.indexOf(","));
          rd = rd.trim();

          regExists=this.testForRegisterPresence(rd);
          if(!regExists /*The Value Register does not exist*/){
            success=false;
            this.setNotification("Dest Register in instruction " + (i+1) + " does not exist");
            setTimeout((function(){
              home.setNotification("")
            }), 3000);
            break;
          }
          e=e.substring(e.indexOf(" ")+1, e.length);
          rs=e.substring(0, e.indexOf(" "));
          rs = rs.trim();

          regExists=this.testForRegisterPresence(rs, true);

          if(!regExists /*The Source Register does not exist*/){
            success=false;
            this.setNotification("Source Register in instruction " + (i+1) + " does not exist");
            setTimeout((function(){
              home.setNotification("")
            }), 3000);
            break;
          }

          e=e.substring(e.indexOf(" ")+1, e.length);
          // Trim out all the spaces and new lines.
          e=e.trim();

          instructions.push([op, rd, rs, null, null , null, null]);

      }
      else if (opType === InstrTypes.REGISTER) {

        let rd = "";
        let rs = "";
        let rt = "";
        let regExists = false;

        e = e.substring(e.indexOf(" ") + 1, e.length);
        rd = e.substring(0, e.indexOf(",")).trim();

        regExists = this.testForRegisterPresence(rd, false);
        if (!regExists /*The Value Register does not exist*/) {
          if (rd.substr(0) === "Z") {
            this.setNotification("Cannot use RZ as a Destination Register");
          } else {
            this.setNotification("Dest Register in instruction " + (i+1) + " does not exist");
          }
          success = false;

          setTimeout((function(){
            home.setNotification("")
          }), 3000);
          break;

        }
        e=e.substring(e.indexOf(",")+1, e.length);

        rs=e.substring(0, e.indexOf(","));
        rs = rs.trim();
        regExists=this.testForRegisterPresence(rs, true);

        if(!regExists /*The Source Register does not exist*/){
          this.setNotification("First Source Register in instruction " + (i+1) + " does not exist");
          success=false;
          setTimeout((function(){
            home.setNotification("")
          }), 3000);
          break;
        }

        e=e.substring(e.indexOf(",")+1, e.length).trim();

        let idx = e.indexOf(' ');
        if (idx != -1)
          rt = e.substring(0, idx);
        else {
          rt = e.substring(0, e.length);
        }

        rt = rt.trim();

        regExists=this.testForRegisterPresence(rt, true);

        if(!regExists /*The Source Register does not exist*/){
          this.setNotification("Second Source Register in instruction " + (i+1) + " does not exist");
          success=false;
          setTimeout((function(){
            home.setNotification("")
          }), 3000);
          break;
        }

        e=e.substring(e.indexOf(" ")+1, e.length);
        // Trim out all the spaces and new lines.
        e=e.trim();

        instructions.push([op, rd, rs, rt, null , null, null]);

      }
      else if (opType == InstrTypes.BRANCH  || opType == InstrTypes.JUMP) {
        let disp = "";
        console.log("compile: opType is BRANCH or JUMP, e = " + e);
        disp = e.substring(e.indexOf(" ") + 1, e.length)
                .replace(/\(/g, '')
                .replace(/\)/g, '')
                .trim();
        console.log("compile: opType is BRANCH or JUMP, disp = " + disp);
        instructions.push([op, null, null, null, null , null, disp]);
      }
      else if (opType === InstrTypes.EMPTY) {

        e=e.substring(e.indexOf(" ")+1, e.length);
        e=e.trim();

        instructions.push([op, null, null, null, null , null, null]);

      }

      else if (opType === InstrTypes.COMPARE){
        let rs="";
        let rt="";

        let regExists=false;


        e=e.substring(e.indexOf(" ")+1, e.length);
        rs=e.substring(0, e.indexOf(",")).trim();

        regExists=this.testForRegisterPresence(rs, true);

        if(!regExists /*The Value Register does not exist*/){
          this.setNotification("Dest Register in instruction " + (i+1) + " does not exist");
          success=false;
          setTimeout((function(){
            home.setNotification("")
          }), 3000);
          break;

        }
        e=e.substring(e.indexOf(",")+1, e.length).trim();

        let idx = e.indexOf(' ');
        if (idx != -1)
          rt = e.substring(0, idx);
        else {
          rt = e.substring(0, e.length);
        }

        console.log("Bob! e=" + e + " and rt=" + rt);

        regExists=this.testForRegisterPresence(rt, true);

        if(!regExists /*The Source Register does not exist*/){
          this.setNotification("Source Register in instruction " + (i+1) + " does not exist");
          success=false;
          setTimeout((function(){
            home.setNotification("")
          }), 3000);
          break;
        }

        e=e.substring(e.indexOf(" ")+1, e.length);
        // Trim out all the spaces and new lines.
        e=e.trim();

        instructions.push([op, null, rs, rt, null , null, null]);
      }
    }

    console.log("instructions are" , instructions);
    if (success) { /*  If there are no*/
      home.setNotification(successfulAssembley);
    }
    setTimeout((function(){
      home.setNotification("");
    }), 3000);

  }
  fullReset(){
    this.reset();
    this.memoryWipe();
  }

  reset(){
    this.resetRegisters();
    this.resetMemory();
    this.resetCounter();
  }

  resetCounter(){
    this.setState({ secondsElapsed: 0 });
    clearInterval(this.incrementer);
  }

  resetRegisters() {
    // Iterate through registers and reset to their initial values.
    for (var i=0; i < OP_REGS.length; i++) {
      armInstrs.LI(OP_REGS[i], 0);
    }
    for (var j=0; j < UTIL_REGS.length; j++) {
      if (j == 0 || j == 2)
        armInstrs.LI(UTIL_REGS[j], 1);
      else
        armInstrs.LI(UTIL_REGS[j], 0);
      }
    this.setState({operationRegs : OP_REGS, utilRegs : UTIL_REGS});
  }

  memoryWipe() {
    this.state.inputMem.clear();
    this.state.memory.clear();
    this.state.dataValStr = "";
    this.setState({inputMem})
    this.setState({memory: MEMORY})
  }

  resetMemory() {
    MEMORY.clear();
    // This clears the memory_Ops while retaining the pointer.
    MEMORY_OPS.length = 0;
    for (let [k, v] of this.state.inputMem) {
      // Read what was held in the inputArray, and put that in the MEMORY
      MEMORY.set(k, v);
    }
    this.setState({MEMORY, MEMORY_OPS, inputMem})
  }

  updateDataArray() {
    let dataValStr = this.state.dataValStr

    if (dataValStr != null) {
      let strs = dataValStr.split(",");
      const memMax = strs.length * 2;
console.log("DFSD'");
      for (const[k, v ] of MEMORY) {
        if (k < memMax)
          strs[(k/2)] = v;
      }
      dataValStr = strs.join(", ");
    }
    this.setState({dataValStr});
  }

  testForRegisterPresence(reg, isDest) {
    if (reg.toUpperCase() === "ZERO") return isDest;
    if (reg.length > 2 || reg.substr(0, 1) !== "R") return false;

    let regNum = 0;
    try { regNum = parseInt(reg.substr(-1)) } catch(err) { return false; }
    return (regNum >= 0 && regNum < OP_REGS.length);
  }
}

export default App;
