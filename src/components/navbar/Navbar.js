import React, { Component } from 'react'
import { auth } from '../../firebase'; 
import { signOut } from 'firebase/auth';
import './Navbar.css'

export default class Navbar extends Component {
  logout = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  render() {
    return (
      <div className='navbarContainer'>
        <div className='appAuthTitle'>JAI</div>
        <div>
          <div className='navbarButton' onClick={this.logout}><div className = "textStyle">Logout</div></div>
        </div>
      </div>
    )
  }
}
