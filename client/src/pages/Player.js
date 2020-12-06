import '../styles/Player.css';
import '../styles/Input.scss'
import '../styles/Dropdown.css'
import PlayerItem from '../components/PlayerItem';
import ResultItem from '../components/ResultItem';
import InnerTopNavBar from '../components/InnerTopNavBar';
import ContactsPane from '../components/ContactsPane';
import ManageContactsPane from '../components/ManageContactsPane';
import React, { useState } from 'react'
import logo from '../resources/logo.svg';
import Select from 'react-select';

const options = require('../resources/options');

export default class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchName: undefined,
            attribute: undefined,
            min: undefined,
            max: undefined,
            start: undefined,
            end: undefined
        }

        this.handleNewSearchTyped = this.handleNewSearchTyped.bind(this);
        this.hanldeNewAttrSelected = this.hanldeNewAttrSelected.bind(this);
        this.handleNewMaxTyped = this.handleNewMaxTyped.bind(this);
        this.handleNewMinTyped = this.handleNewMinTyped.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewStartTyped = this.handleNewStartTyped.bind(this);
        this.handleNewEndTyped = this.handleNewEndTyped.bind(this);
    }

    handleNewStartTyped(event) {
        this.setState({ start: event.target.value});
    };

    handleNewEndTyped(event) {
        this.setState({end: event.target.value});
    };

    handleNewSearchTyped(event) {
        this.setState({ searchName: event.target.value });
    };

    handleNewMaxTyped(event) {
        /*if (event.target.value < 0) {
            alert('Min of attribute cannot be less than 0')
            this.setState({min: 0});
        } else if (event.target.value > 100) {
            alert('Max of attribute cannot be greater than 100')
            this.setState({max: 100});
        } else if(event.target.value < this.state.min) {
            alert('Max of attribute cannot be lower than Min');
            this.setState({max: 100});
        } else {
        this.setState({max: event.target.value});
        } */
        this.setState({max: event.target.value});
    };

    handleNewMinTyped(event) {
        /*if (event.target.value < 0) {
            alert('Min of attribute cannot be less than 0')
            this.setState({min: 0});
        } else if (event.target.value > 100) {
            alert('Min of attribute cannot be greater than 100')
            this.setState({min: 0});
        } else if(event.target.value > this.state.max) {
            alert('Min of attribute cannot be greater than Max');
            this.setState({min: 0});
        } else {
        this.setState({min: event.target.value});
        } */
        this.setState({min: event.target.value});
    };

    hanldeNewAttrSelected(valueArr) {

        if (valueArr === null) {
            this.setState({attribute: undefined});
        } else {
            this.setState({attribute: valueArr.value});
        }
        
    };

    handleSubmit(event) {
        var min = parseInt(this.state.min);
        var max = parseInt(this.state.max);
        var end = parseInt(this.state.end);
        var start = parseInt(this.state.start);

        console.log('clicked');
        if (end > 2020) {
            alert('Enter an end date for birth before 2020');
        } else if (this.state.attribute !== undefined) {
            if (this.state.min === undefined && this.state.max === undefined) {
                alert('Enter a min or max value to go with your selected attribute!')
            } else if (min < 0) {
                alert('Min of attribute cannot be less than 0');
            } else if (min > max) {
                console.log(this.state.min, this.state.max);
                alert('Min of attribute cannot be greater than Max');
            } else if (max < min) {
                alert('Max of attribute cannot be less than Min');
            } else if (max > 100) {
                alert('Max of attribute cannot be greater than 100');
            } else {
                console.log('wTF');
            }
        } else {
            if (this.state.min !== undefined || this.state.max !== undefined) {
                alert('Enter an attribute to go with your min/max value');
            }
        }
    }
    
    render() {
        const { inputValue, menuIsOpen } = this.state;
        return (

            <div >
                <InnerTopNavBar></InnerTopNavBar>
                <div className="Players">
                    
                    <div className="PlayerSearch">
                        
                        <div className="searchBar">
                        <img src={logo} className="Player-logo" alt="logo" />
                            <div className="form__group field">
                            <input type="input" className="form__field" placeholder="Search for a Player Name ..." name="name" id='name' onChange={this.handleNewSearchTyped} required />
                            <label htmlFor="name" className="form__label">Player Name</label>
                            </div>
                        <button className="submit" onClick= {this.handleSubmit}> 
                            <img src={logo} className="Player-logo" alt="logo" />
                        </button>
                        </div>
                        <div className="searchAttr">
                        <div className = "dateContainer">

                        
                            <div className="form__group field">
                            <input type="input" className="form__field" placeholder="e.g. 1962" name="startdate" id='startdate' onChange={this.handleNewStartTyped} required />
                            <label htmlFor="startdate" className="form__label">Start Date</label>
                            </div>
                        </div>
                        <div className = "dateContainer">
                            <div className="form__group field">
                            <input type="input" className="form__field" placeholder="e.g. 1969" name="enddate" id='enddate' onChange={this.handleNewEndTyped} required />
                            <label htmlFor="enddate" className="form__label">End Date</label>
                            </div>
                        </div>
                        <div className = "dropContainer"> 
                        <Select
                        isClearable
                        isSearchable
                        inputValue={inputValue}
                        onChange={this.hanldeNewAttrSelected}
                        className="selector"
                        name="color"
                        options={options}
                        menuIsOpen={menuIsOpen}
                        />
                        </div>
                        <div className = "enterContainer">
                        
                            <div className="form__group field">
                            <input type="input" className="form__field" placeholder="e.g. 69" name="min" id='min' onChange={this.handleNewMinTyped} required />
                            <label htmlFor="min" className="form__label">Min</label>
                            </div>
                        </div>
                        <div className = "enterContainer">
                            <div className="form__group field">
                            <input type="input" className="form__field" placeholder="e.g. 96" name="max" id='max' onChange={this.handleNewMaxTyped} required />
                            <label htmlFor="max" className="form__label">Max</label>
                            </div>
                        </div>
                        </div>
                        
                        
                        
                        
                    </div>
                    
                    <div className="PlayerPane">
                        <PlayerItem id = '10' name = 'Lionel Messi' date = '01.01.2020' rating='96'></PlayerItem>
                    </div>
                    <div className="ResultsPane">
                        <ResultItem id = '10' name = 'Lionel Messi' date = '01.01.2020' rating='96'></ResultItem>
                        {this.state.attribute} {this.state.min} {this.state.max} {this.state.searchName} {this.state.start} {this.state.end}
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

/*<div className="dropdown">
                                <button className="dropbtn">Dropdown</button>
                                <div className="dropdown-content">
                                    <button onClick = {console.log('clicked!')}>Link 1</button>
                                </div>*/