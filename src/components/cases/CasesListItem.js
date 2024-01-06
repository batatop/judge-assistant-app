import React, { Component } from 'react'
import { deleteCase } from './functions'

export default class CasesListItem extends Component {
    deleteCase = () => {
        deleteCase(this.props.uid, this.props.caseId)
    }

    openCase = () => {
        console.log('open case')
    }

    render() {
        return (
            <div className='caseListItem' onClick={this.openCase}>
                <div>{this.props.caseName}</div>
                <div className='caseDeleteButton' onClick={this.deleteCase}>Delete</div>
            </div>
        )
    }
}
