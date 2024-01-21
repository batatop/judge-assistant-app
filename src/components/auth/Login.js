import React, { Component } from 'react';
import { auth } from '../../firebase'; // assuming you have a firebase.js file
import AppInput from '../general/AppInput';
import AppButton from '../general/AppButton';
import './Auth.css';
import Logo from '../general/Logo';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  login = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className='authContainer'>
        <div className='authInnerContainer'>
          <div className='appAuthTitle'>
            <Logo size={'4em'}/>
          </div>
          <AppInput value={this.state.email} onChange={this.handleChange} type="email" name="email" placeholder="Enter email" />
          <AppInput value={this.state.password} onChange={this.handleChange} type="password" name="password" placeholder="Enter password" />
          <AppButton value="Login" onClick={this.login} />
        </div>
      </div>
    )
  }
}