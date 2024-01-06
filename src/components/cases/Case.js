import React, { Component } from 'react'
import { uploadCaseFile } from './functions';
import { db } from '../../firebase';
import { url } from '../../constants';
import CaseFileItem from './CaseFileItem';

export default class Case extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      case: {}
    }
  }

  componentDidMount() {
    const caseId = getCaseId();
    const caseRef = db.ref(`${url}/cases/${this.props.uid}/${caseId}`);
    caseRef.on("value", (snapshot) => {
      const data = snapshot.val() || {};
      this.setState({ case: data });
    }, (error) => {
      console.log(error)
    })
  }

  handleFileChange = (e) => {
    if (e.target.files[0]) {
      this.setState({ file: e.target.files[0] });
    }
  }

  handleUpload = () => {
    if (this.state.file) {
      const { uid } = this.props;
      const caseId = getCaseId();
      uploadCaseFile(uid, caseId, this.state.file).then(() => {
        console.log('file uploaded')
        this.setState({ file: null });
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  listCaseFiles = () => {
    if (this.state.case?.files && Object.keys(this.state.case.files).length === 0) {
      return (
        <div>No case files</div>
      )
    }

    return Object.keys(this.state.case.files || {}).map((fileId) => {
      return (
        <CaseFileItem key={fileId} fileId={fileId} caseId={getCaseId()} uid={this.props.uid} fileName={this.state.case.files[fileId].name} />
      )
    })
  }

  render() {
    return (
      <div>
        <div>
          <input type="file" onChange={this.handleFileChange} />
          <button onClick={this.handleUpload}>Upload</button>
        </div>
        <div>
          {this.listCaseFiles()}
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
