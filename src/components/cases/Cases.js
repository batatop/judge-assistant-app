import React, { Component } from 'react'
import { addCase } from './functions'
import './Cases.css'
import { db } from '../../firebase';
import { url } from '../../constants';
import CasesListItem from './CasesListItem';
import AppInput from '../general/AppInput';
import AppButton from '../general/AppButton';
import addIcon from '../assets/plus-circle.svg'
import moment from 'moment';

export default class Cases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cases: {},
            newCaseName: ''
        }
    }

    componentDidMount() {
        const casesRef = db.ref(`${url}/cases/${this.props.uid}`);
        casesRef.on("value", (snapshot) => {
            const data = snapshot.val() || {};
            this.setState({ cases: data, newCaseName: '' });
        }, (error) => {
            console.error(error)
        })
    }

    getCasesList = () => {
        if (Object.keys(this.state.cases).length === 0) {
            return (
                <div>No cases</div>
            )
        }

        return Object.keys(this.state.cases).map((caseId) => {
            // Convert to milliseconds (since Moment.js requires milliseconds)
            const timestampInMilliseconds = this.state.cases[caseId]?.timestamp;

            // Use Moment.js to convert to a date
            const caseDate = (timestampInMilliseconds && moment(timestampInMilliseconds).format('DD/MM/YYYY')) || '';

            return (
                <CasesListItem key={caseId} caseId={caseId} caseName={this.state.cases[caseId]?.name} caseDate={caseDate} uid={this.props.uid} />
            )
        })
    }

    addCase = () => {
        addCase(this.props.uid, this.state.newCaseName)
    }

    render() {
        return (
            <div className='caseContainer'>
                <div className='addCaseContainer'>
                    <div className="chatHeader">Add New Case</div>
                    <AppInput value={this.state.newCaseName} onChange={(e) => this.setState({ newCaseName: e.target.value })} placeholder='Case Name' onEnter={this.addCase}  />
                    <AppButton value='Add Case' onClick={this.addCase} icon={addIcon} />
                </div>
                <div className="casesContainer">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="casesHeader" style={{ justifyContent: 'initial' }}>My Cases</div>
                        <div style={{ width: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 4 }}>
                            <div className="casesHeader">Date</div>
                            <div className="casesHeader">Delete Case</div>
                        </div>
                    </div>
                    {this.getCasesList()}
                </div>
            </div>
        )
    }
}
