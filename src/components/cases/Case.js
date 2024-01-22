import React, { Component } from 'react'
import { sendMessage, uploadCaseFile } from './functions';
import { db } from '../../firebase';
import { url, userRoles } from '../../constants';
import CaseFileItem from './CaseFileItem';
import './Cases.css'
import AppButton from '../general/AppButton';
import sendIcon from '../assets/send.svg'
import ChatMessage from './ChatMessage';
import moment from 'moment';

export default class Case extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      case: {},
      chatMessage: '',
      openDropdown: false,
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
          const date = (this.state.case?.chat?.[messageId]?.timestamp && moment(this.state.case?.chat?.[messageId]?.timestamp).format('HH:mm')) || '';
          const sender = this.state.case?.chat?.[messageId]?.type === userRoles.user ? 'You' : 'Agent';
          return (
          <ChatMessage key={messageId} type={message.type} text={this.state.case.chat[messageId].message} date={date} sender={sender}/>
        )
      }

      return null
    })
  }

  getFacts(type) {
    let factText = ''
    if (!this.state.case?.chat || (this.state.case?.chat && Object.keys(this.state.case.chat).length === 0)) {
      return null
    }

    Object.keys(this.state.case.chat).map((messageId) => {
      const message = this.state.case.chat[messageId];
      let startIndex = message.message.indexOf('SUMMARY')
      let endIndex = message.message.indexOf('DISPUTED')
      if (type === 'disputed') {
        startIndex = message.message.indexOf('DISPUTED')
        endIndex = message.message.indexOf('UNDISPUTED')
      }
      else if (type === 'undisputed') {
        startIndex = message.message.indexOf('UNDISPUTED')
        endIndex = message.message.length
      }
      if (endIndex > 0) {
        factText = message.message.substring(startIndex, endIndex)
        if (type !== 'summary') {
          let factTextParts = factText.split('-')
          // remove first part
          factTextParts.shift()
          // remove new lines and first/end spaces
          factTextParts = factTextParts.map((part) => {
            return part.replace(/(\r\n|\n|\r)/gm, "").trim()
          })
          // number each item and join with new line
          factText = factTextParts.map((part, index) => {
            return `${index + 1}. ${part}`
          }).join('\n')
          console.log(factText)
        }
        else {
          factText = factText.replace(/(\r\n|\n|\r)/gm, "").trim()
          factText = factText.substring(7, factText.length)
        }
      }
    })

    return factText
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
        {this.state.openDropdown === 'upload' ? (
          <div className="chatOuterContainer">
            <div className="chatContainer" onClick={() => this.setState({ openDropdown: false })}>
              <div className="chatHeader">Upload</div>
              <div>x</div>
            </div>
            <div className="chatInfoContainer" style={{ flexDirection: 'column', display: this.state.openDropdown === 'upload' ? 'initial' : 'none' }}>
              <input type="file" onChange={this.handleFileChange} />
              <AppButton value='Upload' onClick={this.handleUpload} />
              <div>
                {/* list cases */}
                <div className="casesContainer" style={{ display: 'flex', flexDirection: 'row' }}>
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
          <div className="chatOuterContainer" style={{ flex: 'initial' }} onClick={() => this.setState({ openDropdown: 'upload' })}>
            <div className="chatContainer">
              <div className="chatHeader">Upload</div>
              <div>+</div>
            </div>
          </div>
        )}

        {this.state.openDropdown === 'summary' ? (
          <div className="chatOuterContainer">
            <div className="chatContainer" onClick={() => this.setState({ openDropdown: false })}>
              <div className="chatHeader">Summary</div>
              <div>x</div>
            </div>

            <div className="chatInfoContainer" style={{ alignItems: 'center', flexDirection: 'column', display: this.state.openDropdown === 'summary' ? 'flex' : 'none' }}>
              {this.getFacts('summary')}
            </div>
          </div>
        ) : (
          <div className="chatOuterContainer" style={{ flex: 'initial' }} onClick={() => this.setState({ openDropdown: 'summary' })}>
            <div className="chatContainer">
              <div className="chatHeader">Summary</div>
              <div>+</div>
            </div>
          </div>
        )}

        {/* disputed */}
        {this.state.openDropdown === 'disputed' ? (
          <div className="chatOuterContainer">
            <div className="chatContainer" onClick={() => this.setState({ openDropdown: false })}>
              <div className="chatHeader">Disputed Facts</div>
              <div>x</div>
            </div>

            <div className="chatInfoContainer" style={{ alignItems: 'center', flexDirection: 'column', display: this.state.openDropdown === 'disputed' ? 'flex' : 'none' }}>
              {this.getFacts('disputed')}
            </div>
          </div>
        ) : (
          <div className="chatOuterContainer" style={{ flex: 'initial' }} onClick={() => this.setState({ openDropdown: 'disputed' })}>
            <div className="chatContainer">
              <div className="chatHeader">Disputed Facts</div>
              <div>+</div>
            </div>
          </div>
        )}

        {/* undisputed */}
        {this.state.openDropdown === 'undisputed' ? (
          <div className="chatOuterContainer">
            <div className="chatContainer" onClick={() => this.setState({ openDropdown: false })}>
              <div className="chatHeader">Unisputed Facts</div>
              <div>x</div>
            </div>

            <div className="chatInfoContainer" style={{ alignItems: 'center', flexDirection: 'column', display: this.state.openDropdown === 'undisputed' ? 'flex' : 'none' }}>
              {this.getFacts('undisputed')}
            </div>
          </div>
        ) : (
          <div className="chatOuterContainer" style={{ flex: 'initial' }} onClick={() => this.setState({ openDropdown: 'undisputed' })}>
            <div className="chatContainer">
              <div className="chatHeader">Unisputed Facts</div>
              <div>+</div>
            </div>
          </div>
        )}

        {/* chat */}
        <div className='chatOuterContainer chat'>
          <div className="chatContainer"><div className="chatHeader">Chat</div></div>
          <div className="chatInfoContainer chat">{this.getChatMessages()}</div>

          <div className="sendContainer">
            <input type="text" className="appInput" placeholder="Type Message..." onChange={this.handleChatMessageChange} value={this.state.chatMessage} style={{ width: '100%' }} />
            <AppButton value='Send' onClick={this.sendMessage} icon={sendIcon} />
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
