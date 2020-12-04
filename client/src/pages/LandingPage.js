import logo from '../resources/logo.svg';
import '../styles/OuterPages.css';
import TopNavBar from '../components/TopNavBar';
import LoginForm from '../components/LoginForm';
import React from 'react'


export default class LandingPage extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    }
    //this.setUser = this.setUser.bind(this);
  }

  render() {
    return (
      <div data-testid = "landing" className="App">
        <TopNavBar></TopNavBar>
        <div style={{float: 'right', alignSelf: 'right', marginRight: '5vw'}}>
          <LoginForm></LoginForm>
        </div>
        <br></br>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    );
  }
  
}

