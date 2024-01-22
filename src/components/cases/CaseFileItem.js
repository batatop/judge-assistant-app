import React, { Component } from 'react'
import { deleteFile } from './functions';
import './Cases.css'
import xIcon from '../assets/x-circle.svg';

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
                    <div className='caseDeleteButton casesHeader' onClick={this.deleteFileItem}>
                        <img src={xIcon} alt='delete' />
                    </div>
                </div>
            
        );
    }

}

export default CaseFileItem;
