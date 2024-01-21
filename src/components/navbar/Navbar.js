import React, { Component } from 'react'
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './Navbar.css'
import { routes } from '../../routes';
import { useNavigate, useParams } from 'react-router-dom';

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
        <div className='appAuthTitle button' onClick={this.openCases}>JAI</div>
        <div>
          <div className='navbarButton' onClick={this.logout}><div className="textStyle">Logout</div></div>
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