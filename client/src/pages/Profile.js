import '../styles/Profile.css'
import React from 'react';
import InnerTopNavBar from '../components/InnerTopNavBar';
import {getFavPlayers} from './../fetcher';
import {ScrollView} from '@cantonjs/react-scroll-view';

export default class Profile extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      favPlayers: [],
      favTeams: [],
    }
   // this.handleNewPasswordTyped = this.handleNewPasswordTyped.bind(this);
   // this.handlePasswordChange = this.handlePasswordChange.bind(this);
    //this.validatePassword = this.validatePassword.bind(this);
    this.updateSelPlayer = this.updateSelPlayer.bind(this);
  }

  componentDidMount() {
    getFavPlayers(sessionStorage.getItem('username'))
    .then (res => {
      if (res.message === 'success') {
        this.setState({favPlayers: res.data});
        console.log(res.data);
      } else {
        console.log("failed to get fav players");
      }
    });
  }

  /*async handleDeactivateAcc(event) {
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
  } */
  updateSelPlayer(newSelPos) {
    //window.location.href = `http://localhost:3000/player?sel=${newSelPos}`;
    window.location.assign('/player');
  }

//change className later
  render() {
    return (
      <div>
          <InnerTopNavBar></InnerTopNavBar>
        <div className = 'main'>
          <div className = 'profileTitle'>
            <div className = 'titleContainer'>
              <p style = {{'fontWeight': 'bold'}}>Welcome Raymond!</p>
              <p style = {{'fontStyle':'italic', 'font-size': '18px'}}>Start a search for a player or team using the pages in the top right!</p>
              <p style = {{'fontStyle':'italic', 'font-size': '18px'}}>Your favourited players and teams will appear here!</p>
           </div>
          </div>

          <div className = 'profileContainer'>
            <div className='fav-box'>
                      <h2 className='fav-title'>Your Favourite Players</h2>
                      <br></br>
                      <div className="profilePlayerPane">
                        <ScrollView style={{height: '100%'}}>
                          {this.state.favPlayers.map((item, i) => (
                                      //<div onClick = {this.props.updateReceiver(item.firstname)}>
                                      <div>
                                          <div className="playerItem" key = {item.ID} style = {{cursor: 'pointer'}} onClick={() => {this.updateSelPlayer(i)}}>
                                              <div className = "playerStats">
                                                  <ul>
                                                      <li className = "playerName">{item.PLAYER_NAME}</li>
                                                      <li className = "playerDate">Born: {item.BIRTHYEAR} Last Eval: {new Date(item.EVAL_DATE).getMonth() + 1}.{new Date (item.EVAL_DATE).getFullYear()}</li>
                                                  </ul>
                                              </div>
                                              {item.OVERALL_RATING < 65 &&
                                                  <div className="playerRating" style = {{'background': 'linear-gradient(90deg,#b08d57 0%, #804a00 100%)'}}>
                                                      {item.OVERALL_RATING}
                                                  </div>
                                              }
                                              {(item.OVERALL_RATING > 64 && item.OVERALL_RATING < 75) &&
                                                  <div className="playerRating" style = {{'background': 'linear-gradient(90deg,#d3d3d3 0%, #363838 100%)'}}>
                                                      {item.OVERALL_RATING}
                                                  </div>
                                              }
                                              {item.OVERALL_RATING > 74 &&
                                                  <div className="playerRating" style = {{'background': 'radial-gradient(#ffdf00, #d4af37, #ffd700)'}}>
                                                      {item.OVERALL_RATING}
                                                  </div>
                                              }
                                          </div>
                                          
                                      </div>

                          ))}
                          </ScrollView> 
                      </div>
                      
            </div>
            <div className='fav-box'>
                    <h2 className='fav-title'>Your Favourite Teams</h2>
                      <br></br>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


/*<ScrollView style={{height: '100%'}}>
                        {this.state.favPlayers.map((item, i) => (
                                    //<div onClick = {this.props.updateReceiver(item.firstname)}>
                                    <div>
                                        <div className="playerItem" key = {item.ID} style = {{cursor: 'pointer'}} onClick={() => {this.updateSel(item.PLAYER_NAME, item.EVAL_DATE, i)}}>
                                            <div className = "playerStats">
                                                <ul>
                                                    <li className = "playerName">{item.PLAYER_NAME}</li>
                                                    <li className = "playerDate">Born: {item.BIRTHYEAR} Last Eval: {new Date(item.EVAL_DATE).getMonth() + 1}.{new Date (item.EVAL_DATE).getFullYear()}</li>
                                                </ul>
                                            </div>
                                            {item.OVERALL_RATING < 65 &&
                                                <div className="playerRating" style = {{'background': 'linear-gradient(90deg,#b08d57 0%, #804a00 100%)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                            {(item.OVERALL_RATING > 64 && item.OVERALL_RATING < 75) &&
                                                <div className="playerRating" style = {{'background': 'linear-gradient(90deg,#d3d3d3 0%, #363838 100%)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                            {item.OVERALL_RATING > 74 &&
                                                <div className="playerRating" style = {{'background': 'radial-gradient(#ffdf00, #d4af37, #ffd700)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                        </div>
                                        
                                    </div>

                        ))}
                        </ScrollView> */