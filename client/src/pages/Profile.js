
import '../styles/OuterPages.css';
import React from 'react'
import InnerTopNavBar from '../components/InnerTopNavBar'
import {changePassword, deactivateAcc, getUser} from '../fetcher'

export default class Profile extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      newPassword: '',
      password: '',
      date: '',
    }
    this.handleNewPasswordTyped = this.handleNewPasswordTyped.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }

  componentDidMount() {
    getUser(sessionStorage.getItem('username')).then(res => {
      this.setState({password : res.result.password});
      this.setState({date : res.result.date});
    });
    this.setState({username : sessionStorage.getItem('username')});
  }

  handleNewPasswordTyped(event) {
    this.setState({ newPassword: event.target.value });
  }

  async handlePasswordChange(event) {
    event.preventDefault();
      if (this.validatePassword()) {
        changePassword(this.state.username, this.state.newPassword)
        .then(res => {
            if (res.error) {
                alert(res.error);
            } else if (res.message === 'success') {
                alert("Password changed!")
                this.setState({password : this.state.newPassword});
            }
        });
  }
  }

  async handleDeactivateAcc(event) {
    event.preventDefault();
    deactivateAcc(this.state.username)
    .then(res => {
      if (res.error) {
        alert(res.error);
      } else if (res.message === 'success') {
        alert("Account Deactivated! Now being Logged out");
        sessionStorage.setItem('username', null);
        window.location.assign('/');
        //Potentially more cleanup required, cannot test safely until backend for cognito handling implemented
      }
    });
  }

  validatePassword() {
    if (this.state.newPassword.length < 8) {
        alert("Password must be at least 8 characters long!");
        return false;
    }

    if (!/\d/.test(this.state.newPassword)) {
        alert("Password must contain digits!");
        return false;
    }

    if (!/^(.*[A-Z].*)$/.test(this.state.newPassword)) {
        alert("Password must contain uppercase characters!");
        return false;
    }

    if (!/^(.*[a-z].*)$/.test(this.state.newPassword)) {
        alert("Password must contain lowercase characters!");
        return false;
    }

    if (!/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(this.state.newPassword)) {
        alert("Password must contain special characters!");
        return false;
    }

    return true;
  }

//change className later
  render() {
    return (
      <div>
          <InnerTopNavBar></InnerTopNavBar>
        <h1>Profile</h1>
        <p>Username: {this.state.username}</p>
        <p>Password(temporary): {this.state.password}</p>
        <p>Registration Date: {this.state.date}</p>
        <div className='LoginForm'>
                    <h2 className='LoginForm-title'>Change Password</h2>
                    <br></br>
                    <form onSubmit={this.handlePasswordChange}>

                        <input className="LoginForm-input" type="text" name="name" placeholder="..." value={this.state.newPassword} onChange={this.handleNewPasswordTyped} />
                        <br></br>
                        <input className="LoginForm-button" type="submit" value="Add" />
                    </form>
                </div>
                <div className='LoginForm'>
                    <h2 className='LoginForm-title'>Deactivate Account</h2>
                    <br></br>
                    <form onSubmit={this.handleDeactivateAcc}>
                        <input className="LoginForm-button" type="submit" value="Deactivate Account!" />
                    </form>
                </div>
      </div>
    );
  }
}


/*import '../styles/OuterPages.css';
import React from 'react'
import InnerTopNavBar from '../components/InnerTopNavBar'
import {getUser} from '../fetcher'

export default class Profile extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      password: '',
    }

  }

  componentDidMount() {
    getUser(sessionStorage.getItem('username')).then(res => {
      this.setState({date : res.result.date})
    });
  }

  render() {
    return (
      <div>
          <InnerTopNavBar></InnerTopNavBar>
        <h1>Profile</h1>
        <p>Username: {sessionStorage.getItem('username')}</p>
        <p>Registration Date: {this.state.date}</p>

      </div>
    );
  }
} */

