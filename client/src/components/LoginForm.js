import React from 'react'
import '../styles/LoginForm.css'
import {loginUser, getName, getUser, getUsers, createGoogleUser} from '../fetcher'
import GoogleLogin from 'react-google-login'

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
        this.handleGoogleSubmit = this.handleGoogleSubmit.bind(this);
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

    async handleGoogleSubmit(res) {
        var users;
        await getUsers().then(res => {
            if (res.message === 'success') {
                users = res.users;
            } else {
                console.log("Failed to get users!");
            }
        })
        console.log(users);
        if (!users.some(e => e.googleid === res.profileObj.googleId)) { //user does not exist,so create new one
            console.log('Create User');
            await createGoogleUser(res.profileObj.email, res.profileObj.givenName, res.profileObj.googleId)
            .then(response => {
                console.log(response);
                if (response.message === 'success') {
                    sessionStorage.setItem('username', res.profileObj.givenName);
                    console.log('reached');
                    window.location.assign('/profile');
                } else {
                    alert('Error in Google Login, please login using email and password!')
                }
            }); 
        } else {
            sessionStorage.setItem('username', res.profileObj.givenName); // technically should be id (but would require extra fetch)
            window.location.assign('/profile');
        }
    }

    render() {
        return (
            <div className='LoginForm'>
                <h2 className='LoginForm-title'>Login</h2>
                <br></br>
                <form onSubmit={this.handleSubmit}>
                <GoogleLogin
                clientId="1094452346635-fpk0us508l6psu1i64et4ahmiu1uamo9.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={(response) => {console.log(response); this.handleGoogleSubmit(response)}}
                onFailure={(response) => {console.log(response);}}
                cookiePolicy={'single_host_origin'}
                />
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