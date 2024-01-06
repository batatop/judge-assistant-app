import React, { Component } from 'react';
import { auth } from '../../firebase'; // assuming you have a firebase.js file

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
            console.log(errorCode, errorMessage);
        });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <form>
          <input value={this.state.email} onChange={this.handleChange} type="email" name="email" placeholder="Enter email" />
          <input value={this.state.password} onChange={this.handleChange} type="password" name="password" placeholder="Enter password" />
          <button type="submit" onClick={this.login}>Login</button>
        </form>
      </div>
    )
  }
}