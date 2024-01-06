import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { routes } from "./routes";
import Login from "./components/auth/Login";
import Case from "./components/case/Case"; // assuming you have a Case component
import { auth } from './firebase'; // assuming you have a firebase.js file
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from "./components/navbar/Navbar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      this.setState({ user: user });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <Router>
        <div>
          {this.state.user && <Navbar />}
          <Routes>
            {this.state.user ? (
              <Route path={routes.case} element={<Case />} />
            ) : (
              <Route path={routes.login} element={<Login />} />
            )}
            <Route path="*" element={<Navigate to={this.state.user ? routes.case : routes.login} />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;