import React from 'react'
import '../styles/LoginForm.css'
import { addUser, remUser, getUsers, getContacts, changePassword, deactivateAcc  } from '../fetcher'

export default class ManageContactsPane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            add:'',
            remove: ''
        };


        this.handleAddChange = this.handleAddChange.bind(this);
        this.handleRemoveChange = this.handleRemoveChange.bind(this);


        this.handleSubmitAdd = this.handleSubmitAdd.bind(this);
        this.handleSubmitRemove = this.handleSubmitRemove.bind(this);

    }



    handleAddChange(event) {
        this.setState({ add: event.target.value });
    }

    handleRemoveChange(event) {
        this.setState({ remove: event.target.value });
    }

    async handleSubmitAdd(event) {
        event.preventDefault();
        if (this.state.add) {
                var exists = false;
                await getUsers()
                .then(res => {
                    console.log(res);
                    res.users.forEach(element => {
                    if (element.username === this.state.add) {
                    exists = true;
                    }
                    });
                });

                if (exists) {
                addUser(sessionStorage.getItem('username'), this.state.add)
                .then(res => {
                    if (res.message !== 'success' ) {
                       alert(res.error);
                    } else {
                        alert(`${res.added} was added to your contact list!`);
                    }
                });
                } else {
                    alert('user does not exist!');
                }

        } else {
            alert("All fields are required!");
        }
    }

    async handleSubmitRemove(event) {
        event.preventDefault();
        if (this.state.remove) {
                var exists = false;
                await getContacts(sessionStorage.getItem('username'))
                .then(res => {
                    console.log(res.contacts);
                    res.contacts.forEach(element => {
                    if (element === this.state.remove) {
                    console.log(element);
                    console.log(this.state.remove);
                    exists = true;
                    }
                    });
                });
                console.log(exists);
                if (exists) {
                remUser(sessionStorage.getItem('username'), this.state.remove)
                .then(res => {
                    if (res.message !== 'success' ) {
                        alert('user is not a contact!');
                    } else {
                        alert(`${res.removed} was removed from your contact list!`);
                    }
                });
                } else {
                    alert('user is not a contact!');
                }

        } else {
            alert("All fields are required!");
        }
    }

    render() {
        return (
            <div>
                <div className='LoginForm'>
                    <h2 className='LoginForm-title'>Add</h2>
                    <br></br>
                    <form onSubmit={this.handleSubmitAdd}>

                        <input className="LoginForm-input" type="text" name="name" placeholder="Contact Name" value={this.state.add} onChange={this.handleAddChange} />
                        <br></br>
                        <input className="LoginForm-button" type="submit" value="Add" />
                    </form>
                </div>
                <br></br>
                <div className='LoginForm'>
                    <h2 className='LoginForm-title'>Remove</h2>
                    <br></br>
                    <form onSubmit={this.handleSubmitRemove}>

                        <input className="LoginForm-input" type="text" name="name" placeholder="Contact Name" value={this.state.remove} onChange={this.handleRemoveChange} />
                        <br></br>
                        <input className="LoginForm-button" type="submit" value="Remove" />
                    </form>
                </div>
                

            </div>
        )
    }

}