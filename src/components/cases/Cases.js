import React, { Component } from 'react'
import { addCase } from './functions'
import './Cases.css'
import { db } from '../../firebase';
import { url } from '../../constants';
import CasesListItem from './CasesListItem';

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
            console.log(error)
        })
    }

    getCasesList = () => {
        if (Object.keys(this.state.cases).length === 0) {
            return (
                <div>No cases</div>
            )
        }

        return Object.keys(this.state.cases).map((caseId) => {
            return (
                <CasesListItem key={caseId} caseId={caseId} caseName={this.state.cases[caseId]?.name} uid={this.props.uid} />
            )
        })
    }

    addCase = () => {
        addCase(this.props.uid, this.state.newCaseName)
    }

    render() {
        return (
            <div>
                <div className='addCaseContainer'>
                    <input type='text' value={this.state.newCaseName} onChange={(e) => this.setState({ newCaseName: e.target.value })} placeholder='New Case Name'/>
                    <div className='appButton' onClick={this.addCase}>Add Case</div>
                </div>
                <div>
                    {this.getCasesList()}
                </div>
            </div>
        )
    }
}
