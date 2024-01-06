import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteCase } from './functions';
import { routes } from '../../routes';

class CasesListItem extends Component {
    deleteCaseItem = () => {
        deleteCase(this.props.uid, this.props.caseId);
    }

    openCase = () => {
        this.props.navigate(`${routes.case.replace(':id', this.props.caseId)}`);
    }

    render() {
        return (
            <div className='caseListItem' onClick={this.openCase}>
                <div>{this.props.caseName}</div>
                <div className='caseDeleteButton' onClick={this.deleteCaseItem}>Delete</div>
            </div>
        );
    }
}

function CasesListItemWithRouter(props) {
    const navigate = useNavigate();
    const params = useParams();

    return <CasesListItem {...props} navigate={navigate} params={params} />;
}

export default CasesListItemWithRouter;