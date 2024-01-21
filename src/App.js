import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { routes } from "./routes";
import Login from "./components/auth/Login";
import { auth } from './firebase'; // assuming you have a firebase.js file
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from "./components/navbar/Navbar";
import Cases from "./components/cases/Cases";
import Case from "./components/cases/Case";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null
    };
  }

  componentDidMount() {
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      this.setState({ uid: user?.uid });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <Router>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden'
        }}>
          {this.state.uid && <Navbar />}
          <Routes>
            {this.state.uid ? (
              <>
                <Route path={routes.cases} element={<Cases uid={this.state.uid} />} />
                <Route path={routes.case} element={<Case uid={this.state.uid} />} />
              </>
            ) : (
              <Route path={routes.login} element={<Login />} />
            )}
            <Route path="*" element={<Navigate to={this.state.uid ? routes.cases : routes.login} />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;