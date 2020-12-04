import '../styles/Contacts.css';
import InnerTopNavBar from '../components/InnerTopNavBar';
import ContactsPane from '../components/ContactsPane';
import ManageContactsPane from '../components/ManageContactsPane';
import React, { useState } from 'react'


export default class Contacts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (

            <div >
                <InnerTopNavBar></InnerTopNavBar>
                <div className="contacts">
                
                    
                    <div className="ContactsPane">
                    <h1>Contacts</h1>
                        <ContactsPane></ContactsPane>
                    </div>
                    <div className="ManageContactsPane">
                    <h1>Manage</h1>
                        <ManageContactsPane></ManageContactsPane>
                    </div>


                </div>


            </div>

        );
    }
}