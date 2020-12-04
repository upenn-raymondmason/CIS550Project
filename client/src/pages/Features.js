import logo from '../resources/logo.svg';
import '../styles/OuterPages.css';
import TopNavBar from '../components/TopNavBar';
import React from 'react'


export default class Features extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div className="App">
        <TopNavBar></TopNavBar>
        <br></br>
        <h1>Features</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    );
  }
}