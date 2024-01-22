import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteCase } from './functions';
import { routes } from '../../routes';
import xIcon from '../assets/x-circle.svg';

class CasesListItem extends Component {
    deleteCaseItem = (e) => {
        e.stopPropagation();
        e.preventDefault();
        deleteCase(this.props.uid, this.props.caseId);
    }

    openCase = () => {
        this.props.navigate(`${routes.case.replace(':id', this.props.caseId)}`);
    }

    render() {
        return (
            <div className = "caseListItemContainer"><div className='caseListItem' onClick={this.openCase}>
                <div>{this.props.caseName}</div>
                <div style={{
                        width:200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding:4
                }}>
                    <div className='casesHeader content'>{this.props.caseDate}</div>
                    <div className='caseDeleteButton casesHeader' onClick={this.deleteCaseItem}>
                        <img src={xIcon} alt='delete' />
                    </div>
                </div>
            </div></div>
            
        );
    }
}

function CasesListItemWithRouter(props) {
    const navigate = useNavigate();
    const params = useParams();

    return <CasesListItem {...props} navigate={navigate} params={params} />;
}

export default CasesListItemWithRouter;