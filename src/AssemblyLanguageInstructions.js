import React from 'react';
import './App.css';
// import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/journal/bootstrap.css";

/* The Simple Virtual Machine

This part of the problem set involves working with Simple Virtual Machine,
henceforth known as SVM. SVM is simple because it only has the very basics
of the full von Neumann architecture, it has neither a stack nor a heap.
It's virtual because we'll actually implement it in (OCaml) software.

SVM has 8 registers and 16 Operations.

Registers

Register PC is the program counter,
Register PSW is the program status word,
Register RA is the return address register,
Register Zero holds the constant 0,
Registers RO through R3 are general purpose registers.

SVM Operations

SVM has 16 Operations. In the descriptions below, Rd, Rs and Rt refer
to one of the general purpose registers, with Rd denoting a destination
of an operation and Rs and Rt denoting source registers. We'll use the
symbol RAM to refer to the random access memory, the symbol addr to refer
to a non-negative integer address in memory and the notation RAM[addr]
to refer to the contents of location addr in the memory. We'll use the
symbol disp to refer to an integer displacement that may (or may not)
be added to the PC register to alter the flow of control.

All Operations leave the RA and PSW register alone unless specified
otherwise.

LOD Rd, offset(Rs): Let base be the contents of register Rs.
                    Then this loads RAM[base + offset] into register Rd.
Li Rd, number:      Loads number into register Rd.
STO Rs, offset(Rd): Let base be the contents of register Rd, stores
                    the contents of register Rs into location
                    base + offset in the memory.
MOV Rd, Rs:         Copies the contents of register Rs into register Rd.
ADD Rd, Rs, Rt:     Adds the contents of registers Rs and Rt and stores
                    the sum in register Rd.
SUB Rd, Rs, Rt:     Subtracts the contents of register Rt from Rs and
                    stores the difference in register Rd.
MUL Rd, Rs, Rt:     Multiplies the contents of register Rt by Rs and
                    stores the product in register Rd.
DIV Rd, Rs, Rt:     Divides the contents of register Rs by Rt and stores
                    the integer quotient in register Rd.
CMP Rs, Rt:         HLT PSW = Rs - Rt.
JSR disp:           Sets RA = PC and then PC = PC + disp.
R:                  sets PC = RA.
BLT disp:           If PSW is negative, causes the new value of PC to be
                    the sum PC + disp. Note that if disp is negative, this
                    will cause the program to jump backward in the sequence
                    of instructions. If PSW >= 0, this instruction does nothing.
BEQ disp:
BGT disp:
JMP disp:           Causes the new value of PC to be the sum PC + disp.
HLT:                Causes the svm machine to stop.
*/
var Operations = {

  LOD: "LOD", // LOD Rd, offset(Rs): let base be the contents of register Rs.
              // Then this loads RAM[base + offset] into register Rd.
  LI:  "Li",  // Li Rd, number: loads number into register Rd.
  STO: "STO", // STO Rs, offset(Rd): let base be the contents of register Rd,
              // stores the contents of register Rs into location base + offset
              // in the memory.
  MOV: "MOV", // MOV Rd, Rs: copys the contents of register Rs into register Rd.

  ADD: "ADD", // ADD Rd, Rs, Rt: adds the contents of registers Rs and Rt
              // and stores the sum in register Rd.
  SUB: "SUB", // SUB Rd, Rs, Rt: subtracts the contents of register Rt
              // from Rs and stores the difference in register Rd.
  MUL: "MUL", // MUL Rd, Rs, Rt: multiplies the contents of register Rt
              // by Rs and stores the product in register Rd.
  DIV: "DIV", // DIV Rd, Rs, Rt: divides the contents of register Rs by
              // Rt and stores the integer quotient in register Rd.
  CMP: "CMP", // Leaves the difference Rs - Rt in the PSW.
  JSR: "JS",  // JSR disp: sets RA = PC and then PC = PC + disp.
  R:   "R",   // R: sets PC = RA.
  BLT: "BLT", // BLT disp: if PSW is negative, causes the new value of PC
              // to be the sum PC + disp. Note that if disp is negative,
              // this will cause the program to jump backward in the
              // sequence of Operations. If PSW >= 0, this instruction
              // does nothing.
  BEQ: "BEQ",
  BGT: "BGT",
  JMP: "JMP", // JMP disp: causes the new value of PC to be the sum PC + disp.
  HLT: "HLT", // causes the svm machine to print the contents of registers
              // PC, PSW, RA, R0, R1, R2 and R3. It then stops, returning ().

  operations: {
    // The following Operations are Memory based operations.
    //
    // Input: Rd, Offset, Rs
    // EX: STO R0, 0(R1)
    "LOD": {name: "LOD", code: "M"},
    "STO": {name: "STO", code: "M"},

    // The following are Transfer based operations.
    // Input: varies for the two
    "LI":  {name: "LI",  code: "TI"},
    "MOV": {name: "MOV", code: "TR"},

    "ADD": {name: "ADD", code: "R"},
    "SUB": {name: "SUB", code: "R"},
    "MUL": {name: "MUL", code: "R"},
    "DIV": {name: "DIV", code: "R"},

    "CMP": {name: "CMP", code: "C"},

    "BLT": {name: "BLT", code: "B"},
    "BEQ": {name: "BEQ", code: "B"},
    "BGT": {name: "BGT", code: "B"},
    "JSR": {name: "JSR", code: "B"},

    "JMP": {name: "JMP", code: "J"},
    "R"  : {name: "R",   code: "E"},
    "HLT": {name: "HLT", code: "E"},
  }
};

export default class AssemblyLanguageOperations extends React.Component {

  getOperationType(opnName) {
    let operation = Operations.operations[opnName.toUpperCase()];
console.log("getOperationType: opn = " + operation);
    return (opnName === undefined) ? "X" : operation.code;
  }

  executeInstruction(opnName, Rd , Rs, Rt, number, offset, disp) {
    opnName = opnName.toUpperCase();
    console.log(opnName);
    if(opnName === "LOD"){
      this.LOD(Rd, offset, Rs);
    }
    else if (opnName === "LI") {
      this.LI(Rd, number);
    }
    else if (opnName === "STO") {
      this.STO(Rd, offset, Rs);
    }
    else if (opnName === "MOV") {
      this.MOV(Rd, Rs);
    }
    else if (opnName === "ADD") {
      this.ADD(Rd, Rs, Rt);
    }
    else if (opnName === "SUB") {
      this.SUB(Rd, Rs, Rt);
    }
    else if (opnName === "MUL") {
      this.MUL(Rd, Rs, Rt);
    }
    else if (opnName === "DIV") {
      this.DIV(Rd, Rs, Rt);
    }
    else if (opnName === "CMP") {
      this.CMP(Rs, Rt);
    }
    else if (opnName === "JSR") {
      this.JSR(disp);
    }
    else if (opnName === "R") {
      this.R();
    }
    else if (opnName === "BLT") {
      this.BLT(disp);
    }
    else if (opnName === "BGT") {
      this.BGT(disp);
    }
    else if (opnName === "BEQ") {
      this.BEQ(disp);
    }
    else if (opnName === "JMP") {
      this.JMP(disp);
    }
    else if (opnName === "HLT") {
      this.HLT();
    }
  }

  // LOD Rd, offset(Rs): let base be the contents of register Rs.
  // Then this loads RAM[base + offset] into register Rd.
  LOD(Rd, offset, Rs) {
    const base = Rs.value * 2;
    console.log("Offset", offset);
    console.log("RD", Rd);
    console.log("RS", Rs);
    const dest = base + offset
    console.log(dest);
    const val = this.props.memory.get(dest); // Val is RAM[base + offset]
    console.log(val);
    Rd.value = val;
  }

  // STO Rs, offset(Rd): let base be the contents of register Rd,
  // stores the contents of register Rs in location base + offset.
  STO(Rs, offset, Rd) {
    const val = Rs.value;
    const base = Rd.value;
    const dest = base + offset;
    this.props.memory.set(dest, val); // Mem = location base + offset in memory
  }

  // Li Rd, number: loads number into register Rd.
  LI(Rd, number) {
    const num = number;
    Rd.value = num;
  }

  // MOV Rd, Rs: copies the contents of register Rs into register Rd.
  MOV(Rd, Rs) { Rd.value = Rs.value; }

  // ADD Rd, Rs, Rt: adds the contents of registers Rs and Rt and stores
  // the sum in register Rd.
  ADD(Rd, Rs, Rt) {
    Rd.value = this.round(Number(Rs.value) + Number(Rt.value), 0);
  }
  SUB(Rd, Rs, Rt) { Rd.value = this.round((Rs.value - Rt.value), 0); }
  MUL(Rd, Rs, Rt) { Rd.value = this.round((Rs.value * Rt.value), 0); }
  DIV(Rd, Rs, Rt) { Rd.value = Math.floor((Rs.value / Rt.value), 0); }

  // CMP Rs, Rt: sets PSW = Rs - Rt. If Rs > Rt, then PSW will be positive,
  // if Rs == Rt, then PSW will be 0 and if Rs < Rt, then PSW will be negative.
  CMP(RS, RT) { this.props.utilRegs[1].value = RS.value - RT.value; }

  // JSR disp: sets RA = PC and then PC = PC + disp.
  JSR(disp) {
    const pc = this.props.utilRegs[0].value
    this.props.utilRegs[2].value = pc;          // Set RA = PC
    const newPC = pc + disp;
    this.props.utilRegs[0].value = newPC; // Set PC = PC + disp;
  }

  // R: sets PC = RA.
  R() { this.props.utilRegs[0].value = this.props.utilRegs[2].value; }

  // BLT disp: if PSW is negative, causes the new value of PC to
  // be the sum PC + disp. Note that if disp is negative,
  // this will cause the program to branch backward in the sequence
  // of Operations. If PSW >= 0, this instruction does nothing.
  BLT(disp) {
    const  psw = this.props.utilRegs[1].value;
    if (psw < 0) {
      const pc = this.props.utilRegs[0].value;
      this.props.utilRegs[0].value = pc + disp;
    }
  }

  // BEQ disp: if PSW == 0, causes the new value of PC to be the sum
  // PC + disp. Note that if disp is negative, this will cause the program
  // to branch backward in the sequence of Operations. If PSW != 0, this
  // instruction does nothing.
  BEQ(disp) {
    const psw = this.props.utilRegs[1].value;
    if (psw === 0) {
      const pc = this.props.utilRegs[0].value;
      this.props.utilRegs[0].value = pc + disp;
    }
  }

  // BGT disp: if PSW > 0, causes the new value of PC to
  // be the sum PC + disp. Note that if disp is negative,
  // this will cause the program to branch backward in the sequence
  // of Operations. If PSW != 0, this instruction does nothing.
  BGT(disp) {
    const psw = this.props.utilRegs[1].value;
    if (psw > 0) {
      const pc = this.props.utilRegs[0].value;
      this.props.utilRegs[0].value = pc + disp;
    }
  }

  // JMP disp: causes the new value of PC to be the sum PC + disp.
  JMP(disp) {
    const pc = this.props.utilRegs[0].value;
    this.props.utilRegs[0].value = pc + disp;
  }

  HLT() {
    this.props.utilRegs[0].value = 1000;  // hack to make force halt
   console.log("I just called HLT!");
   this.props.setNotification("Maya & Cleo"); }

  round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }
}
