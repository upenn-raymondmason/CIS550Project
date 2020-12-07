import '../styles/Player.css';
import '../styles/Input.scss'
import '../styles/Dropdown.css'
import PlayerItem from '../components/PlayerItem';
import InnerTopNavBar from '../components/InnerTopNavBar';
import React, { useState } from 'react';
import {ScrollView} from '@cantonjs/react-scroll-view';
import logo from '../resources/logo.svg';
import Select from 'react-select';
import {getPlayers, getPlayerData} from '../fetcher';
import ResultItem from '../components/ResultItem';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
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
            end: undefined,
            results: [],
            selName: undefined,
            selEvalDate: undefined,
            selData: undefined,
            pos: 0,
            posMax: undefined,
            selPos: undefined,
            rand: 0
        }

        this.handleNewSearchTyped = this.handleNewSearchTyped.bind(this);
        this.hanldeNewAttrSelected = this.hanldeNewAttrSelected.bind(this);
        this.handleNewMaxTyped = this.handleNewMaxTyped.bind(this);
        this.handleNewMinTyped = this.handleNewMinTyped.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewStartTyped = this.handleNewStartTyped.bind(this);
        this.handleNewEndTyped = this.handleNewEndTyped.bind(this);
        this.updateResults = this.updateResults.bind(this);
        this.updateSel = this.updateSel.bind(this);
        this.updateSelData = this.updateSelData.bind(this);
        this.updatePos = this.updatePos.bind(this);
        this.updateRand = this.updateRand.bind(this);
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
        this.setState({max: event.target.value});
    };

    handleNewMinTyped(event) {
        this.setState({min: event.target.value});
    };

    hanldeNewAttrSelected(valueArr) {

        if (valueArr === null) {
            this.setState({attribute: undefined});
        } else {
            this.setState({attribute: valueArr.value});
        }
        
    };

    updateRand(val) {
        this.setState({rand: val});
    };

    updateResults(results) {
        this.setState({results: results});
    }

    updateSel(newSelName, newSelEvalDate, newSelPos) {
        this.setState({selPos: newSelPos});
        this.setState({selName: newSelName});
        var evalYear =  new Date(newSelEvalDate).getFullYear();
        var evalMonth =  new Date(newSelEvalDate).getMonth();
        this.setState({selEvalDate: new Date(newSelEvalDate)});
        this.setState({pos : 0});
        getPlayerData(newSelName)
        .then(res => {
            this.updateSelData(res.data);
            this.setState({posMax: res.data.length});
        });
        //this.forceUpdate();
    }

    updatePos(shift) {

        if (!((this.state.pos + shift > this.state.posMax - 1) || (this.state.pos + shift < 0))) {
            this.setState({pos: this.state.pos + shift})
        }
        console.log(this.state.pos, this.state.posMax);
    }

    updateSelData(newData) {
        this.setState({selData: newData});
    }

    handleSubmit(event) {
        this.setState({selPos: undefined});
        this.setState({selData: undefined});
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
                getPlayers(this.state.searchName, this.state.start, this.state.end, this.state.attribute, this.state.min, this.state.max)
                .then(res => {
                    if (res.message !== 'success') {
                        console.log(res.err);
                    } else {
                        this.updateResults(res.data);
                        console.log(this.state.results);
                    }
                });
            }
        } else {
            if (this.state.min !== undefined || this.state.max !== undefined) {
                alert('Enter an attribute to go with your min/max value');
            } else {
                getPlayers(this.state.searchName, this.state.start, this.state.end, this.state.attribute, this.state.min, this.state.max)
                .then(res => {
                    if (res.message !== 'success') {
                        console.log(res.err);
                    } else {
                        this.updateResults(res.data);
                        console.log(this.state.results);
                    }
                });
            }
        }
    }
    
    render() {
        const { inputValue, menuIsOpen } = this.state;
        var resultVal;
        console.log(this.state.selData);
        console.log(this.state.selName);
        if (this.state.selData === undefined) {
            resultVal = <div> <p>Please Select a search result to see detailed Stats!</p> </div>;
        } else {
            var col;
            var curr = this.state.selData[this.state.pos];
            if (curr.OVERALL_RATING < 65) {
            col = 'linear-gradient(90deg,#b08d57 0%, #804a00 100%)';
            } else if (curr.OVERALL_RATING > 64 && curr.OVERALL_RATING < 75) {
            col = 'linear-gradient(90deg,#d3d3d3 0%, #363838 100%)';
            } else if (curr.OVERALL_RATING > 75) {
            col = 'radial-gradient(#ffdf00, #d4af37, #ffd700)';
            }
            resultVal = 
            <div className = "playerMainContainer">
                <div className="playerItem" >
                <div className = "playerStats">
                    <ul>
                        <li className = "playerName">{curr.PLAYER_NAME}</li>
                        <li className = "playerDate">Born: {curr.BIRTHYEAR} Selected Eval: {new Date(curr.DATE_EVALUATED).getMonth() + 1}.{new Date(curr.DATE_EVALUATED).getFullYear()}</li>
                    </ul>
                </div>
               
               <div className="playerRating" style = {{'background': col}}>
                    {curr.OVERALL_RATING}
               </div>
               </div>
                <div className="playerData">
                    <table className="playerTable">
                        <colgroup>
                            <col span = "1" style = {{ width:"20%"}}/>
                            <col span = "1" style = {{ width:"5%"}}/>
                            <col span = "1" style = {{ width:"20%"}}/>
                            <col span = "1" style = {{ width:"5%"}}/>
                            <col span = "1" style = {{ width:"20%"}}/>
                            <col span = "1" style = {{ width:"5%"}}/>
                            <col span = "1" style = {{ width:"20%"}}/>
                            <col span = "1" style = {{ width:"5%"}}/>
                        </colgroup>
                        
                        <thead>
                        <tr>
                            <th>Overall</th>
                            <th></th>
                            <th>Attack</th>
                            <th></th>
                            <th>Midfield</th>
                            <th></th>
                            <th>Defense</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Pace:</td>
                            <td>{curr.SPRINT_SPEED}</td>
                            <td>Finishing: </td>
                            <td>{curr.FINISHING}</td>
                            <td>Short Passing:</td>
                            <td>{curr.SHORT_PASSING}</td>
                            <td>Standing Tackle:</td>
                            <td>{curr.STANDING_TACKLE}</td>
                        </tr>
                        <tr>
                            <td>Ball Control:</td>
                            <td>{curr.BALL_CONTROL}</td>
                            <td>Shot Power: </td>
                            <td>{curr.SHOT_POWER}</td>
                            <td>Long Passing:</td>
                            <td>{curr.LONG_PASSING}</td>
                            <td>Sliding Tackle:</td>
                            <td>{curr.SLIDING_TACKLE}</td>
                        </tr>
                        <tr>
                            <td>Stamina:</td>
                            <td>{curr.STAMINA}</td>
                            <td>Long Shots: </td>
                            <td>{curr.LONG_SHOTS}</td>
                            <td>Crossing:</td>
                            <td>{curr.CROSSING}</td>
                            <td>Interceptions:</td>
                            <td>{curr.INTERCEPTIONS}</td>
                        </tr>
                        </tbody>
                        
                    </table>
                </div>
                <div className = "playerContainer">
                <div className = "playerButtons">
                
                    <div className = "texts">
                    {this.state.pos === (this.state.posMax - 1) &&
                        'No earlier evaluation available.'
                    }
                    </div>
                
                <div className = "buttons">
                <div class="center-con" onClick = {() => this.updatePos(1)}>
                        <div class="round" style = {{'transform' : 'rotate(180deg)'}}>
                            <div className="cta">
                                <span class="arrow primera next "></span>
                                <span class="arrow segunda next "></span>
                            </div>
                        </div>
                </div>
                <div class="center-con" onClick = {() => this.updatePos(-1)}>
                        <div class="round">
                            <div className="cta">
                                <span class="arrow primera next "></span>
                                <span class="arrow segunda next "></span>
                            </div>
                        </div>
                </div>
                </div>
                
                    <div className = "texts">
                    {this.state.pos === 0 &&
                        'No later evaluation available.'
                    }
                    </div>
                
                
                    </div> 
                    <div style = {{width: '60%', height: '100%'}}>
                    <RadarChart
                    captions={{
                        ball_control: 'Ball Control',
                        finishing: 'Finishing',
                        dribbling: 'Dribbling',
                        sprint_speed: 'Spring Speed',
                        strength: 'Strength',
                        long_passing: 'Long Pass',
                        short_passing: 'Short Pass'
                      }}
                    data={[
                        {
                          data: {
                            ball_control: 0.633,
                            finishing: .499,
                            dribbling: 0.592,
                            sprint_speed: 0.68,
                            strength: 0.674,
                            long_passing: 0.571,
                            short_passing: 0.624
                          },
                          meta: { color: 'blue' }
                        },
                        {
                          data: {
                            ball_control: `${curr.BALL_CONTROL}`/100,
                            finishing: `${curr.FINISHING}`/100,
                            dribbling: `${curr.DRIBBLING}`/100,
                            sprint_speed: `${curr.SPRINT_SPEED}`/100,
                            strength: `${curr.STRENGTH}`/100,
                            long_passing: `${curr.LONG_PASSING}`/100,
                            short_passing: `${curr.SHORT_PASSING}`/100
                          },
                          meta: { color: 'red' }
                        }
                      ]}
                    size = {180}
                    
                />
                <div class="SpiderGraphLegend">
                    <div className = "redRectangle"/>
                    <p className = "legendText"> {curr.PLAYER_NAME} </p>
                    <div className = "blueRectangle" />
                    <p className = "legendText"> Average Player</p>
                </div>
                </div>
                
                </div>
            </div>
        }
        //<PlayerItem pane = 'result' name = {this.state.selName} date = {this.state.selData[this.state.pos].BIRTHYEAR} evalDate = {this.state.selData[this.state.pos].DATE_EVALUATED} rating = {this.state.selData[this.state.pos].OVERALL_RATING}/>
            
        
        return (

            <div >
                <InnerTopNavBar></InnerTopNavBar>
                <div className="Players">
                    
                    <div className="PlayerSearch">
                        
                        <div className="searchBar">
                            <div className="form__group field">
                            <input type="input" className="form__field" placeholder="Search for a Player Name ..." name="name" id='name' onChange={this.handleNewSearchTyped} required />
                            <label htmlFor="name" className="form__label">Player Name</label>
                            </div>
                        <div>
                        <button className="submit" onClick= {this.handleSubmit}> 
                            <img src={logo} className="Player-logo" alt="logo" />
                        </button>
                        </div>
                        
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
                        <ScrollView style={{height: '100%'}}>
                        {this.state.results.map((item, i) => (
                                    //<div onClick = {this.props.updateReceiver(item.firstname)}>
                                    <div>
                                        {this.state.selPos !== i &&
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
                                        }
                                        {this.state.selPos === i &&
                                        <div className="playerItem" key = {item.ID} style = {{cursor: 'pointer', 'background-color': 'rgba(165, 176, 173, 0.8)'}} onClick={() => {this.updateSel(item.PLAYER_NAME, item.EVAL_DATE, i)}}>
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
                                                <div className="playerRating" style = {{'background-color': 'linear-gradient(90deg,#d3d3d3 0%, #363838 100%)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                            {item.OVERALL_RATING > 74 &&
                                                <div className="playerRating" style = {{'background': 'radial-gradient(#ffdf00, #d4af37, #ffd700)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                        </div>
                                        }

                                    </div>

                        ))}
                        </ScrollView>
                    </div>
                            
                    <div className="ResultsPane">
                        {resultVal}
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

/*<div className = "playerButtons">
                    <div class="center-con">
                        <div class="round">
                            <div id="cta">
                                <span class="arrow primera next "></span>
                                <span class="arrow segunda next "></span>
                            </div>
                        </div>
                    </div>
                    <div class="center-con" style={{transform: 'rotate(180deg)'}}>
                        <div class="round">
                            <div id="cta">
                                <span class="arrow primera next "></span>
                                <span class="arrow segunda next "></span>
                            </div>
                        </div>
                    </div>
                    </div> */