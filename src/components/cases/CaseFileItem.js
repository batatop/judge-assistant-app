import React, { Component } from 'react'
import { deleteFile } from './functions';
import './Cases.css'
class CaseFileItem extends Component {
    deleteFileItem = () => {
        deleteFile(this.props.uid, this.props.caseId, this.props.fileId).then(() => {
            console.info('file deleted')
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        return (
            
                <div className='caseListItem'>
                    <div>{this.props.fileName}</div>
                    <div className='caseDeleteButton' onClick={this.deleteFileItem}>
                        X
                    </div>
                </div>
            
        );
    }

}

export default CaseFileItem;
