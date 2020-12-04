import React from 'react';
import ContactItem from './ContactItem';
import '../styles/Contacts.css'
import {getContacts} from './../fetcher';
export default class ContactsPane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            /*results: [{ firstname: "Remo", lastname: "Louis" },
            { firstname: "Adam", lastname: "George" },
            { firstname: "Bino", lastname: "Mendelez" },
            { firstname: "Albert", lastname: "Rem" },
            { firstname: "Rakesh", lastname: "Kumar" },
            { firstname: "Lodu", lastname: "Sharpe" },
            { firstname: "Cao", lastname: "Nima" },
            { firstname: "Big", lastname: "G" }
            ], */
            results: [],

        }
        //this.updateSearchResults = this.updateSearchResults.bind(this) 
    }

    updateSearchResults(results) {
    var actual = [];
    results.forEach(element => {
        if (element !== sessionStorage.getItem('username')) {
            actual.push(element);
        }
    });
    this.setState({results: actual})
    }

    componentDidMount() {
        getContacts(sessionStorage.getItem('username')).then(res => {
            if (res.message !== 'success') {
                console.log('Failed to get contacts for pane...');
            } else {
                this.updateSearchResults(res.contacts);
            }
        });
    }

    componentDidUpdate() {
        getContacts(sessionStorage.getItem('username')).then(res => {
            if (res.message !== 'success') {
                console.log('Failed to get contacts for pane...');
            } else {
                this.updateSearchResults(res.contacts);
            }
        });
    }

    render() {
        return (
            <div>
                <div >
                    {this.state.results.map((item, i) => (
                        //<div onClick = {this.props.updateReceiver(item.firstname)}>
                        <div key = {item}>
                            <ContactItem
                                username={item}
                                key={item}
                            />
                        </div>
                    ))}
                </div>

            </div>
        )
    }
}