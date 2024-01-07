import React, { Component } from 'react'
import { sendMessage, uploadCaseFile } from './functions';
import { db } from '../../firebase';
import { url } from '../../constants';
import CaseFileItem from './CaseFileItem';
import './Cases.css'
import AppButton from '../general/AppButton';

export default class Case extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      case: {},
      chatMessage: ''
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
    if (!this.state.case?.files || (this.state.case?.files && Object.keys(this.state.case.files).length === 0)) {
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

  getChatMessages = () => {
    if (!this.state.case?.chat || (this.state.case?.chat && Object.keys(this.state.case.chat).length === 0)) {
      return (
        <div>No chat messages</div>
      )
    }

    return Object.keys(this.state.case.chat).map((messageId) => {
      return (
        <div key={messageId}>{this.state.case.chat[messageId].message}</div>
      )
    })
  }

  handleChatMessageChange = (e) => {
    console.log(e.target.value);
    this.setState({ chatMessage: e.target.value });
  } 

  sendMessage = () => {
    if (this.state.chatMessage) {
      sendMessage(this.props.uid, getCaseId(), this.state.chatMessage).then(() => {
        console.log('message sent');
        this.setState({ chatMessage: '' });
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  render() {
    return (
      <div>
        {/* upload button */}
        <div>
          <input type="file" onChange={this.handleFileChange} />
          <AppButton value='Upload' onClick={this.handleUpload} />
        </div>

        {/* list cases */}
        <div>
          {this.listCaseFiles()}
        </div>

        {/* chat */}
        <div>
          <div>{this.getChatMessages()}</div>
          <div>
            <input type="text" onChange={this.handleChatMessageChange} value={this.state.chatMessage} />
            <div onClick={this.sendMessage}>Send</div>
          </div>
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
