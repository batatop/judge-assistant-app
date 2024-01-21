import React, { Component } from 'react'
import { sendMessage, uploadCaseFile } from './functions';
import { db } from '../../firebase';
import { url, userRoles } from '../../constants';
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
      console.error(error)
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
        console.info('file uploaded')
        this.setState({ file: null });
      }).catch((error) => {
        console.error(error);
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
      const message = this.state.case.chat[messageId];
      if (message.type !== userRoles.system && this.state.case?.chat?.[messageId]?.message && !this.state.case.chat[messageId].message.startsWith('SUMMARY')) {
        return (
          <div key={messageId}>{this.state.case.chat[messageId].message}</div>
        )
      }

      return null
    })
  }

  handleChatMessageChange = (e) => {
    this.setState({ chatMessage: e.target.value });
  }

  sendMessage = () => {
    if (this.state.chatMessage) {
      sendMessage(this.props.uid, getCaseId(), this.state.chatMessage).then(() => {
        console.info('message sent');
        this.setState({ chatMessage: '' });
      }).catch((error) => {
        console.error(error);
      })
    }
  }

  render() {
    return (
      <div className='caseContainer'>
        {/* upload button */}
        <div className="fileUploadContainer">
          <div className="fileUpload">Upload Case File</div>
          <input type="file" onChange={this.handleFileChange} />
          <AppButton value='Upload' onClick={this.handleUpload} />
        </div>
        {/* list cases */}
        <div>
          <div className="casesContainer" >
            <div className="casesHeader">Case Files</div>
            <div className="casesHeader">Date</div>
            <div className="casesHeader">Delete File</div>

          </div>
          <div className="caseInfoContainer" style={{ flexDirection: 'column' }}>
            {this.listCaseFiles()}
          </div>
        </div>



        {/* chat */}
        <div className='chatOuterContainer'>
          <div className="chatContainer"><div className="chatHeader">Chat</div></div>
          <div className="chatInfoContainer"><div>{this.getChatMessages()}</div></div>

          <div className="sendContainer">
            <input type="text" className="appInput" placeholder="Type Message..." onChange={this.handleChatMessageChange} value={this.state.chatMessage} style={{ width: '100%' }} />
            <div className="appButton" onClick={this.sendMessage}>Send</div>
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
