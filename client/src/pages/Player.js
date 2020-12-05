import '../styles/Player.css';
import '../styles/Input.scss'
import PlayerItem from '../components/PlayerItem';
import InnerTopNavBar from '../components/InnerTopNavBar';
import ContactsPane from '../components/ContactsPane';
import ManageContactsPane from '../components/ManageContactsPane';
import React, { useState } from 'react'
import logo from '../resources/logo.svg';


export default class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchName: '',
        }

        this.handleNewSearchTyped = this.handleNewSearchTyped.bind(this);
    }

    handleNewSearchTyped(event) {
        this.setState({ searchName: event.target.value });
      }
    

    render() {
        return (

            <div >
                <InnerTopNavBar></InnerTopNavBar>
                <div className="Players">
                    
                    <div className="PlayerSearch">
                        <img src={logo} className="Player-logo" alt="logo" />
                        <div className="searchBar">
                            <div class="form__group field">
                            <input type="input" class="form__field" placeholder="Search for a Player Name ..." name="name" id='name' onChange={this.handleNewSearchTyped} required />
                            <label for="name" class="form__label">Player Name</label>
                            </div>
                        </div>
                        
                        
                    </div>
                    
                    <div className="PlayerPane">
                        <PlayerItem id = '10' name = 'Lionel Messi' date = '01.01.2020' rating='96'></PlayerItem>
                    </div>
                    <div className="ResultsPane">
                        {this.state.searchName}
                    </div>
                </div>
            </div>

        );
    }
}

//<PlayerItem id = '10' name = 'Lionel Messi' date = '01.01.2020' rating='96'></PlayerItem>

/*<form className = "form__group field">
                            <input type="text" value="Search for a Player ..." onChange={this.handleNewSearchTyped}/>
                        </form>*/