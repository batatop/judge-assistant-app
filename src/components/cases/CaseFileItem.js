import React, { Component } from 'react'
import { deleteFile } from './functions';

class CaseFileItem extends Component {
    deleteFileItem = () => {
        deleteFile(this.props.uid, this.props.caseId, this.props.fileId).then(() => {
            console.log('file deleted')
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <div className='caseListItemContainer'>
                <div className='caseListItem'>
                    <div>{this.props.fileName}</div>
                    <div className='caseDeleteButton' onClick={this.deleteFileItem}>
                        Delete
                    </div>
                </div>
            </div>
        );
    }

}

export default CaseFileItem;
