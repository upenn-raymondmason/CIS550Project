import React from 'react'
import '../styles/SignupForm.css'
import {createUser} from '../fetcher'
//import moment from 'moment';

export default class SignupForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: ''
        };


        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        
        this.validatePassword = this.validatePassword.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        

        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }


    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    validateEmail() {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(this.state.email).toLowerCase())) {
            alert("Invalid email!");
            return false;
        }
        return true;
    }


    validatePassword() {
        if (this.state.password.length < 8) {
            alert("Password must be at least 8 characters long!");
            return false;
        }

        if (!/\d/.test(this.state.password)) {
            alert("Password must contain digits!");
            return false;
        }

        if (!/^(.*[A-Z].*)$/.test(this.state.password)) {
            alert("Password must contain uppercase characters!");
            return false;
        }

        if (!/^(.*[a-z].*)$/.test(this.state.password)) {
            alert("Password must contain lowercase characters!");
            return false;
        }

        if (!/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(this.state.password)) {
            alert("Password must contain special characters!");
            return false;
        }

        return true;
    }

    handleSubmit(event) {
        event.preventDefault();
        // check if all fields are filled up
        if (this.state.email && this.state.password && this.state.username) {
                if (this.validatePassword() && this.validateEmail()) {
                    createUser(this.state.username, this.state.email, this.state.password, new Date().toLocaleString())
                    .then(res => {
                        if (res.error) {
                            alert(res.error);
                        } else if (res.message === 'success') {
                            alert("A verification email has been sent!")
                            window.location.assign('/');
                        }
                    });
                }  
            } else {
                alert("All fields are required!");
            }
        //console.log(this.state);
        
    }

    render() {
        return (
            <div className='SignupForm'>
                <h2 className='SignupForm-title'>Sign Up</h2>
                <br></br>
                <form onSubmit={this.handleSubmit}>
                    <input className="SignupForm-input" type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange}/>
                    <br></br>
                    <input className="SignupForm-input" type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}/>
                    <br></br>
                    <input className="SignupForm-input" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
                    <br></br>

                    <input id = "SignupForm-button-id" className="SignupForm-button" type="submit" value="Sign up" />
                </form>
            </div>
        )
    }

}