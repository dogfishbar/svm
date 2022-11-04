## Simple VM in React.js

This project was written by Ribhi El-Zaru with the supervision
of Robert Muller for use by the Computer Science 101 Honors class
at Boston College in 2017.

Below you will find some information on how to use this webapp
to visualize and customize your assembly language code, as well
as details regarding constraints and features of the web application.

If you want to open up this web application in your browser and try it out, simply visit

https://ribhiel-zaru.github.io/Assembly-Language-React-VM/


## Installation

Installing the source code for your own experimentation and fine-tuning is simple!

Just download the .zip file, change directory of your terminal to that unzipped folder and enter the following:

```bash
npm install

npm start
```



The web-app should open up in your preferred browser, allowing you to play around with the simple assembly language instructions explained below!

P.S. You may have to type "sudo npm install" instead in order to authorize your computer to download the npm packages required to running this web-app locally.



## The Assembly Language

Description of the Registers used in the SVM are below.

Register PC is the program counter,
Register PSW is the program status word,
Register RA is the return address register,
Register Zero holds the constant 0,
Registers RO through R3 are general purpose registers.


SVM Instructions

SVM has 16 instructions. In the descriptions below, Rd, Rs and Rt refer to one of the general purpose registers, with Rd denoting a destination of an operation and Rs and Rt denoting source registers. We'll use the symbol RAM to refer to the random access memory, the symbol addr to refer to a non-negative integer address in memory and the notation RAM[addr] to refer to the contents of location addr in the memory. We'll use the symbol disp to refer to an integer displacement that may (or may not) be added to the PC register to alter the flow of control.
All instructions leave the RA and PSW register alone unless specified otherwise.

**LOD Rd, offset(Rs):** Let base be the contents of register Rs. Then this loads RAM[base + offset] into register Rd.

**Li Rd, number:** Loads number into register Rd.

**STO Rs, offset(Rd):** Let base be the contents of register Rd, stores the contents of register Rs into location base + offset in the memory.

**MOV Rd, Rs:** Copies the contents of register Rs into register Rd.

**ADD Rd, Rs, Rt:** Adds the contents of registers Rs and Rt and stores the sum in register Rd.

**SUB Rd, Rs, Rt:** Subtracts the contents of register Rt from Rs and stores the difference in register Rd.

**MUL Rd, Rs, Rt:** Multiplies the contents of register Rt from Rs and stores the product in register Rd.

**DIV Rd, Rs, Rt:** Divides the contents of register Rs by Rt and stores the integer quotient in register Rd.

**CMP Rs, Rt:** Sets PSW = Rs - Rt. Note that if Rs > Rt, then PSW will be positive, if Rs === Rt, then PSW will be 0 and if Rs < Rt, then PSW will be negative.

**JSR disp:** Sets RA = PC and then PC = PC + disp.

**R:** sets PC = RA.

**BLT disp:** If PSW is negative, causes the new value of PC to be the sum PC + disp. Note that if disp is negative, this will cause the program to jump backward in the sequence of instructions. If PSW >= 0, this instruction does nothing.

**BEQ disp:** If PSW === 0, causes the new value of PC to be the sum PC + disp. Note that if disp is negative, this will cause the program to jump backward in the sequence of instructions. If PSW != 0, this instruction does nothing.

**BGT disp:** if PSW, is positive, causes the new value of PC to be the sum PC + disp. Note that if disp is negative, this will cause the program to jump backward in the sequence of instructions. If PSW <= 0, this instruction does nothing.

**JMP disp:** causes the new value of PC to be the sum PC + disp.
HLT: causes the svm machine to print the contents of registers PC, PSW, RA, R0, R1, R2 and R3. It then stops, returning ().

## Using the Application

The web application is broken into 5 sections, all explained below.

### Data Segment

The Data Segment is a text field that allows you to place data into the Simple VM. Each number you place must be separated with commas. Since this is a 2 byte machine, every number you input is sent to the next location in Memory that is either 0 or a factor of 2, no matter what. An example is below.

5, 4, 3, 2, 1  map to memory locations, 0, 2, 4, 6, 8, respectively.

If the location of the data you input in memory gets overwritten, the data segment gets overwritten as well.

### Register Display

The Register Display shows what values are held in the 8 registers in our Simple VM.

Register PC is the program counter,
Register PSW is the program status word,
Register RA is the return address register,
Register Zero holds the constant 0,
Registers RO through R3 are general purpose registers.

### Memory Display

The memory display gives you a visual cue as to what data is in the memory currently.

All memory locations able to store a value are indexed by 2, as this is a 2 byte machine.

This is explained in the code segment below.



```java
// The value in R1 is stored at memory address 28 at the end of this method.

LI R0, 24;
STO RO, 2(RZ);
```

###

### Code Editor

The Code Editor is where you type the assembly language programs you wish to run.

In order for the code to compile, each line must be terminated with a ';', just like in Java and C.

Some code examples for you to try out are below:



```java
/*
Example: Factorial

Let the data segment data = [N], where N is a natural number. The following SVM program computes N! storing the result in register R0. The line numbers on the left are for readability.
*/

LI R0, 1;
MOV R2, R0;
LOD   r1, 0(zero);
CMP   R1, zero;
BEQ   3;
MUL   R0, R0, R1;
SUB   R1, R1, R2;
JMP   (-5);
HLT;
```

### Control Console

######

The control console is where you can adjust the time of execution, upload a .txt file with your own pre-written code to the text editor, reset, assemble, play, pause and step through the code.



## Sample Code





```java
/*
Example: Remainder

Let the data segment data = [M; N], where M and N are natural numbers. The following SVM program (in a text segment) computes M mod N storing the remainder in register R0. The line numbers on the left are for readability.
*/

LOD R0, 0(Zero);
LOD R1, 1(Zero);
CMP R0, R1;
BLT 2;
SUB R0, R0, R1;
JMP (-4);
HLT;

```





```java
/*
Example: Factorial

Let the data segment data = [N], where N is a natural number. The following SVM program computes N! storing the result in register R0. The line numbers on the left are for readability.
*/

LI R0, 1;
MOV R2, R0;
LOD   r1, 0(zero);
CMP   R1, zero;
BEQ   3;
MUL   R0, R0, R1;
SUB   R1, R1, R2;
JMP   (-5);
HLT;

```



```java
/*
Example: Count Data

Counts the quantity of Data items in the data segment which is
terminated by the sentinal -1.
*/

MOV R0, ZERO;
MOV R1, R0;
LI R2, 1;
LOD R3, 0(R1);
CMP R3, zero;
BLT 3;
ADD R1, R1, R2;
ADD R0, R0, R2;
JMP (-6);
R;
```



```java
/*
Example: Sum Data

Adds up the Data items in the data segment which is
terminated by the sentinal -1.
*/

MOV R0, ZERO;
MOV R1, R0;
LI R2, 1;
LOD R3, 0(R1);
CMP R3, zero;
BLT 3;
ADD R1, R1, R2;
ADD R0, R0, R3;
JMP (-6);
R;


```



```java
/*
Example: Average Data

Averages up the Data items in the data segment which is
terminated by the sentinal -1.
*/

MOV R0, ZERO;
MOV R1, R0;
LI R2, 1;
LOD R3, 0(R1);
CMP R3, zero;
BLT 3;
ADD R1, R1, R2;
ADD R0, R0, R3;
JMP (-6);
DIV R0, R0, R1;
R;



```



## Credits

I would like to thank Professor Robert Muller of the Boston College Computer Science Department for his support and advice regarding this project as well as the C.S. 101 Honors class he taught for trying out the web application and helping me debug!
