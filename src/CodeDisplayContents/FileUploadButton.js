import React from "react";
import Dropzone from 'react-dropzone';
import '../App.css';

let filesToSend=[];


export default class FileUploadButton extends React.Component {
  constructor() {
    super()
    this.state={
      accept: 'text/plain',
      files: [],
      dropzoneActive: false
    }
  }


  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(files, rejectedFiles) {
    filesToSend=[]
    console.log("files" , files);
    if(files[0] !== undefined){
      filesToSend.push(files[0]);
      this.setState(  {
        filesToBeSent : filesToSend,
        dropzoneActive : false
      }
      );
      this.props.setFiles(filesToSend);
      this.props.changeNoti("File Successfully Uploaded");
    }
    else{
      this.props.changeNoti("File of that sort cannot be uploaded.");
    }

  }

  applyMimeTypes(event) {
    this.setState({
      accept: event.target.value
    });
  }


  render() {
    const { accept, dropzoneActive }=this.state;
    const overlayStyle={
      top: 0,
      right: 0,
      bottom:0,
      left: 0,
      padding: '0',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff'
    };

    return (


      <Dropzone
        style={{}}
        accept={accept}
        onDrop={(files) => this.onDrop(files)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
        setFiles={this.props.setFiles}
      >
        { dropzoneActive && <div style={overlayStyle}>Drop files...</div> }
        <div>
          <p>
            <button>
              Click or drag file to upload file
            </button>
          </p>

        </div>
      </Dropzone>
    );
  }
}
