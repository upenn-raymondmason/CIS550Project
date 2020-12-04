import '../styles/Contacts.css';
import InnerTopNavBar from '../components/InnerTopNavBar';
import ContactsPane from '../components/ContactsPane';
//import ManageContactsPane from '../components/ManageContactsPane';
import React, { useState, useEffect, useRef } from 'react';
//import { getUsers, joinChat, sendMessage } from './getData';
import { sendMessage, getMessages } from './../fetcher';
import { setupWSConnection } from './../notifications';
import Moment from 'moment';

export default class Messaging extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      receiver: sessionStorage.getItem('receiver'),
      messages: [],
      newMessage: '',
    }
    this.updateReceiver = this.updateReceiver.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
  }

 updateReceiver(newReceiver) {
   this.setState({receiver: newReceiver});
 };

 updateMessages(newMessage) {
   console.log(newMessage);
   console.log(this.state.messages);
   var temp = this.state.messages;
   temp.push(newMessage);
   console.log(temp);
   this.setState({messages: temp});
   //console.log(this.state.messages);
 }

  componentDidMount() {
    
    setupWSConnection(this.updateMessages); // setup ws connection -- pass the wrapper functions as parameters

    getMessages(sessionStorage.getItem('username'))
    .then(res => {
      if (res.message !== 'success') {
        alert('Failed to load messages!');
      } else {
        var actual = [];
        res.messages.forEach(element => {
          if(element.sender === this.state.receiver || element.receiver === this.state.receiver) {
            actual.push(element);
          }
        });
        this.setState({messages : actual});
      }
    });
  }

  async sendMsg() {
    const text = document.getElementById('msg').value;
    //const to = document.getElementById('inptto').value;
    const to = this.state.receiver;
    const from = sessionStorage.getItem('username');
    //this.updateMessages({sender: from, receiver: to, text: text, time: new Date()});
    var old = this.state.messages;
    if(text.length > 0 && to.length > 0 && from.length > 0){ 
      sendMessage(from, to, text, new Date()).then(res => {console.log(res);});
    }

    if (old === this.state.messages) {
      console.log('hello');
      this.state.messages.push({sender: from, receiver: to, text: text, time: new Date()});
      console.log(this.state.messages);
    }
  }

//change className later
  render() {
    return (
      <div>
      <InnerTopNavBar></InnerTopNavBar>
      <div className="contacts">
          <div className="ContactsPane">
          <h1>Contacts</h1>
              <ContactsPane receiver = {this.state.receiver} setFunc = {this.updateReceiver}></ContactsPane>
          </div>
      </div>
      <div>
      <div>
        <h2>Message Log with {this.state.receiver}</h2>
        <div>{this.state.messages.map(msg => <p>{msg.sender}: {msg.text} at {msg.time}</p>)}</div>
        <hr></hr>
      </div>
      <div>
       <textarea cols="15" rows="5" id="msg" />
      <button type="button" id="btn" onClick={() => this.sendMsg()}>Send</button>
        </div>
    </div>
      </div>
    );
  }
}