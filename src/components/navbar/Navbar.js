import React, { Component } from 'react'
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './Navbar.css'
import { routes } from '../../routes';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from '../general/Logo';
import NavbarButton from './NavbarButton';
import logoutIcon from '../assets/log-out.svg';
import casesIcon from '../assets/book-open.svg';

class Navbar extends Component {
  logout = () => {
    signOut(auth).then(() => {
      console.info('User signed out');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  openCases = () => {
    this.props.navigate(`${routes.cases}`);
  }

  render() {
    return (
      <div className='navbarContainer'>
        <div className='button' onClick={this.openCases}>
          <Logo />
        </div>
        <div style={{ display: 'flex', flexShrink: 0, justifyContent: 'space-between' }}>
          <NavbarButton text='Cases' onClick={this.openCases} icon={casesIcon} />
          <div style={{ marginLeft: 14 }}>
            <NavbarButton text='Logout' onClick={this.logout} icon={logoutIcon} />
          </div>
        </div>
      </div>
    )
  }
}

function CasesListItemWithRouter(props) {
  const navigate = useNavigate();
  const params = useParams();

  return <Navbar {...props} navigate={navigate} params={params} />;
}
export default CasesListItemWithRouter;