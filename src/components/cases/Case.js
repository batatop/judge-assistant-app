import React, { Component } from 'react'
import { uploadCaseFile } from './functions';

export default class Case extends Component {
  handleFileChange = (e) => {
    if (e.target.files[0]) {
      this.setState({ file: e.target.files[0] });
    }
  }

  handleUpload = () => {
    if(this.state.file) {
      const { uid } = this.props;
      const caseId = getCaseId();
      uploadCaseFile(uid, caseId, this.state.file).then(() => {
        this.setState({ file: null });
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  render() {
    return (
      <div>
        <div>
          <input type="file" onChange={this.handleFileChange} />
          <button onClick={this.handleUpload}>Upload</button>
        </div>
      </div>
    )
  }
}

function getCaseId() {
  const path = window.location.pathname;
  const pathParts = path.split('/');
  return pathParts[pathParts.length - 1];
}
