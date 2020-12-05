import logo from '../resources/logo.svg';
import '../styles/OuterPages.css';
import TopNavBar from '../components/TopNavBar';
import React from 'react'


export default class About extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div data-testid="AboutBox" id="AboutBox" className="App">
        <TopNavBar></TopNavBar>
        <br></br>
        <h1>About</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    );
  }
}

//<img src={logo} className="App-logo" alt="logo" />