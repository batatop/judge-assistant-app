import React, { Component } from 'react'
import { getCases } from './functions'

export default class Cases extends Component {
    componentDidMount() {
        getCases(this.props.uid).then((data) => {
            console.log(data);
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <div>Cases</div>
        )
    }
}
