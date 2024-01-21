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
      chatMessage: '',
      isUploadDropdownOpen: false,
      isSummaryDropdownOpen: false,
      isDisputedDropdownOpen: false,
      isUndisputedDropdownOpen: false,
      isChatDropdownOpen: false
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
        {this.state.isUploadDropdownOpen ? (
          <div className="chatOuterContainer" onClick={() => this.setState(prevState => ({ isUploadDropdownOpen: !prevState.isUploadDropdownOpen }))}>
            <div className="chatContainer">
              <div className="chatHeader">Upload</div>
              <div>x</div>
            </div>
            <div className="chatInfoContainer" style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', display: this.state.isUploadDropdownOpen ? 'flex' : 'none' }}>
              <input type="file" onChange={this.handleFileChange} />
              <AppButton value='Upload' onClick={this.handleUpload} />
              <div>
                {/* list cases */}
                <div className="casesContainer" >
                  <div className="casesHeader">Case Files</div>
                  <div className="casesHeader">Date</div>
                  <div className="casesHeader">Delete File</div>

                </div>
                <div className="caseInfoContainer" style={{ flexDirection: 'column' }}>
                  {this.listCaseFiles()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="chatOuterContainer" style={{ flex: 'initial' }} onClick={() => this.setState(prevState => ({ isUploadDropdownOpen: !prevState.isUploadDropdownOpen }))}>
            <div className="chatContainer">
              <div className="chatHeader">Upload</div>
              <div>+</div>
            </div>
          </div>
        )}

        {this.state.isSummaryDropdownOpen ? (
          <div className="chatOuterContainer" onClick={() => this.setState(prevState => ({ isSummaryDropdownOpen: !prevState.isSummaryDropdownOpen }))}>
            <div className="chatContainer">
              <div className="chatHeader">Summary</div>
              <div>x</div>
            </div>

            <div className="chatInfoContainer" style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', display: this.state.isSummaryDropdownOpen ? 'flex' : 'none' }}>
              Summary content
            </div>
          </div>
        ) : (
          <div className="chatOuterContainer" style={{ flex: 'initial' }} onClick={() => this.setState(prevState => ({ isSummaryDropdownOpen: !prevState.isSummaryDropdownOpen }))}>
            <div className="chatContainer">
              <div className="chatHeader">Summary</div>
              <div>+</div>
            </div>
          </div>
        )}

        {/* disputed */}
        {this.state.isDisputedDropdownOpen ? (
          <div className="chatOuterContainer" onClick={() => this.setState(prevState => ({ isDisputedDropdownOpen: !prevState.isDisputedDropdownOpen }))}>
            <div className="chatContainer">
              <div className="chatHeader">Disputed Facts</div>
              <div>x</div>
            </div>

            <div className="chatInfoContainer" style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', display: this.state.isDisputedDropdownOpen ? 'flex' : 'none' }}>
              Disputed content
            </div>
          </div>
        ) : (
          <div className="chatOuterContainer" style={{ flex: 'initial' }} onClick={() => this.setState(prevState => ({ isDisputedDropdownOpen: !prevState.isDisputedDropdownOpen }))}>
            <div className="chatContainer">
              <div className="chatHeader">Disputed</div>
              <div>+</div>
            </div>
          </div>
        )}

        {/* undisputed */}
        {this.state.isUndisputedDropdownOpen ? (
          <div className="chatOuterContainer" onClick={() => this.setState(prevState => ({ isUndisputedDropdownOpen: !prevState.isUndisputedDropdownOpen }))}>
            <div className="chatContainer">
              <div className="chatHeader">Unisputed Facts</div>
              <div>x</div>
            </div>

            <div className="chatInfoContainer" style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', display: this.state.isUndisputedDropdownOpen ? 'flex' : 'none' }}>
              Unisputed content
            </div>
          </div>
        ) : (
          <div className="chatOuterContainer" style={{ flex: 'initial' }} onClick={() => this.setState(prevState => ({ isUndisputedDropdownOpen: !prevState.isUndisputedDropdownOpen }))}>
            <div className="chatContainer">
              <div className="chatHeader">Unisputed</div>
              <div>+</div>
            </div>
          </div>
        )}

        {/* chat */}
        <div className='chatOuterContainer'>
          <div className="chatContainer"><div className="chatHeader">Chat</div></div>
          <div className="chatInfoContainer">{this.getChatMessages()}</div>

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
