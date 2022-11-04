import React from "react";
import Center from 'react-center';
import DataRow from "./DataRow.js"

import './datatables.css';

let memory = [];

export default class MemoryDisplay extends React.Component {
  constructor(props){
    super(props)

    this.state ={
      memoryOps : this.props.memoryOps
    }
  }

   updateInputMem(){
    this.props.updateInputMem(this.props.memoryOps);
   }
   render() {
     memory.size = 0;
     let  memoryShown;
     if (this.props.memoryOps.size <= 0){
       memoryShown=(

         <center>
            <h5>
              No Contents in Memory
            </h5>
         </center>

       )
     }
     memory.length = 0;
    let index = 0;
     {this.props.memoryOps.forEach(function(value, key){

        if(value.toString().length > 0){
          if(index % 2 == 0){
              memory.push(
                    <center>
                    <DataRow
                       address= {key}
                       value={value}
                       width="200px"
                     />
                    </center>)
                  }
        else{
          memory.push(
                <DataRow
                   address= {key}
                   value={value}
                   width="200px"
                 />
               )
              }
        }
      })}

       return (
         <div>

         <Center>
           <h2> Memory Display </h2>
         </Center>
         {memoryShown}
         <div>
         {memory}
         </div>
         </div>
       )
     }
}
