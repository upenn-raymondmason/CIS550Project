import logo from '../resources/logo.svg';
import '../styles/OuterPages.css';
import TopNavBar from '../components/TopNavBar';
import React from 'react'
import SignupForm from '../components/SignupForm';

export default class Register extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div className="App">
        <TopNavBar></TopNavBar>
        <div style={{float: 'right', alignSelf: 'right', marginRight: '5vw'}}>
          <SignupForm></SignupForm>
        </div>
        <br></br>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    );
  }
}