import React from "react";
import AceEditor from 'react-ace';
import Center from 'react-center';
import ControlConsole from "./CodeDisplayContents/ControlConsole.js"
import brace from 'brace';

import 'brace/mode/java';
import 'brace/theme/github';

//import ReactFileReader from 'react-file-reader';
//import CodeEditor from "./CodeDisplayContainer/CodeEditor.js";

export default class CodeDisplay extends React.Component {

  constructor(props){
    super(props);

    this.state={
      fileArray: [],
    }
  }

/*

this.refs.editor.selection.moveCursorToPosition({row: 1, column: 0});
this.refs.editor.selection.selectLine();
*/
  onEditorChange(e){
    this.props.changeCode(e);
    console.log(this.refs.ace.editor.session);
  }


  render(){
    return(
      <div id="parent">

      <Editor ref = "ace"
          onEditorChange={this.onEditorChange.bind(this)}
          width = {this.props.width/2}
          code = {this.props.code}
      />


      <div id="notification" ref = "noti" >
        {/*TODO Make this font color change. */}
           <Center> {this.props.notification}  </Center>
      </div>

      <div id="ControlConsole">
          <Center>

              <ControlConsole
                    compileCode={this.props.compileCode}
                    changeNoti={this.props.changeNoti}
                    fileArray={this.state.fileArray}
                    playCode={this.props.testRun}
                    fullReset = {this.props.fullReset}
                    stopCode={this.props.stopCode}
                    stepCode={this.props.stepCode}
                    timer={this.props.timer}
                    setFiles={this.onFileDrop.bind(this)}
                    timerChange={this.props.timerChange}
                    />
          </Center>
      </div>
      </div>
    )


  }

    onFileDrop(fileArray){
      this.setState({fileArray});

      fileArray.forEach(file => {
        const reader=new FileReader();

        reader.onload=() => {
          const fileAsBinaryString=reader.result;

          this.props.changeCode( fileAsBinaryString);
        }
        reader.onabort=() => console.log('file reading was aborted');
        reader.onerror=() => console.log('file reading has failed');

        reader.readAsBinaryString(file);
      })
    }

}


class Editor extends AceEditor{

  render(){
    return(
      <div id="editor">
        <AceEditor
           mode="python"
           fontSize="16pt"
           theme="solarized_dark"
           onChange={this.props.onEditorChange}
           width={this.props.width/2}
           value={this.props.code}
           name="UNIQUE_ID_OF_DIV"
           editorProps={{$blockScrolling: true}}
          />

    </div>
    )
  }



}
