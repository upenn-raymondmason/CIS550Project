import React from 'react'
import '../styles/LoginForm.css'
import {loginUser, getName, getUser} from '../fetcher'

export default class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            email: ''
        };


        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        

        this.handleSubmit = this.handleSubmit.bind(this);

    }



    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.state.email && this.state.password) {
            if (true) {
                

                loginUser(this.state.email, this.state.password)
                .then(async res => {
                    console.log(res)
                    if (res.message === 'success') {
                        //if(sessionStorage.getItem('token') === null){
                            const token = res.token;  // get the token (jwt) from the web server
                            console.log(token);
                            //if(token){
                             sessionStorage.setItem('token', token); // store token in session storage
                            //}
                        //}
                        await getName(this.state.email).then(res => {
                                sessionStorage.setItem('username', res.username);
                            });
                        window.location.assign('/profile');
                        return;
                    } else if (res.error.code === "UserNotConfirmedException") {
                        alert("Please confirm your email first")
                    } else if (res.error.message) {
                        alert(res.error.message)
                    }
                });
                //if(sessionStorage.getItem('username') === null){
                    /*const token = await joinChat(name);  // get the token (jwt) from the web server
                      if(token){
                        sessionStorage.setItem('token', token); // store token in session storage
                      } */ //Token system with websocket server
                      
                  //}
            }  
        } else {
            alert("All fields are required!");
        }
    }

    render() {
        return (
            <div className='LoginForm'>
                <h2 className='LoginForm-title'>Login</h2>
                <br></br>
                <form onSubmit={this.handleSubmit}>
                    
                    <input className="LoginForm-input" type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}/>
                    <br></br>
                    <input className="LoginForm-input" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
                    <br></br>
                    <input className="LoginForm-button" type="submit" value="Login" />
                </form>
            </div>
        )
    }

}