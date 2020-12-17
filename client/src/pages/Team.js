import '../styles/Team.css';
import '../styles/Match.css';
import '../styles/Input.scss';
import '../styles/Dropdown.css';
import InnerTopNavBar from '../components/InnerTopNavBar';
import React, { useState } from 'react';
import {ScrollView} from '@cantonjs/react-scroll-view';
import logo from '../resources/logo.svg';
import base from '../resources/pitchBase.svg';
import Select from 'react-select';
import {getTeams, getTeamData, getPlayerDataId, getFormation, getFavTeams, addTeam, remTeam} from '../fetcher';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
import {XYPlot, MarkSeries} from 'react-vis';
const options = require('../resources/options');
//Fav Button from https://codepen.io/mapk/pen/ZOQqaQ
//Input Text from https://codepen.io/lucasyem/pen/ZEEYKdj

export default class Team extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchName: undefined,
            results: [],
            selName: undefined,
            selNameShort: undefined,
            selData: undefined,
            selSeasonData: undefined,
            seasonPos: 0,
            pos: 0,
            posMax: undefined,
            seasonPosMax: undefined,
            selPos: undefined,
            selStats: undefined,
            seasons: ["2015/2016", "2014/2015", "2013/2014", "2012/2013", "2011/2012", "2010/2011", "2009/2010", "2008/2009"],
            selPlayerData: undefined,
            selPosition: undefined,
            favTeams: [],
            rand: 0,
            loaded: false,
            searched: false,
            seasonRating: undefined,
        }

        this.handleNewSearchTyped = this.handleNewSearchTyped.bind(this);
        //this.hanldeNewAttrSelected = this.hanldeNewAttrSelected.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateResults = this.updateResults.bind(this);
        this.updateSel = this.updateSel.bind(this);
        this.updateSelData = this.updateSelData.bind(this);
        this.updatePos = this.updatePos.bind(this);
        this.updateSeasonPos = this.updateSeasonPos.bind(this);
        this.updateSelPlayer = this.updateSelPlayer.bind(this);
    }

    handleNewSearchTyped(event) {
        this.setState({ searchName: event.target.value });
    };


    componentDidMount() {
        getFavTeams(sessionStorage.getItem('username'))
        .then(res => {
            if (res.message === 'success') {
                this.setState({favTeams: res.data});
                this.setState({results: res.data});
            } else {
                console.log('Failed to get fav teams')
            }
        })
    }

    componentDidUpdate = function () {
        var likeButton = document.querySelector(".like-btn");
        console.log(this.state.loaded, this.state.rand);
        if (likeButton !== null && this.state.rand === 0) {
            this.setState({rand: 1});
            console.log(likeButton);
            likeButton.addEventListener("click", () => {
                if (likeButton.classList.value === "like-btn") { // not favourited -> add
                    addTeam(sessionStorage.getItem('username'), this.state.results[this.state.selPos])
                    .then(res => {
                        if (res.message !== 'success') {
                            console.log('Failed to favourite team!');
                        }
                    });
                    var temp = this.state.favTeams;
                    temp.push(this.state.results[this.state.selPos]);
                    this.setState({favTeams: temp});
                } else { // already favourited -> remove
                    //NEW SETS
                    this.setState({selSeasonData: undefined});
                    setTimeout(() => {console.log("waiting")}, 2000);
                    this.setState({selData: undefined});
                    this.setState({selName: undefined});
                    this.setState({selName: undefined});
                    this.setState({selNameLong: undefined});
                    this.setState({selNameShort: undefined});
                    this.setState({seasonPos: undefined});
                    this.setState({pos: undefined});
                    this.setState({posMax: undefined});
                    this.setState({seasonPosMax: undefined});
                    this.setState({selStats: undefined});
                    this.setState({selPlayerData: undefined});
                    this.setState({selPosition: undefined});
                    remTeam(sessionStorage.getItem('username'), this.state.results[this.state.selPos])
                    .then(res => {
                        if (res.message !== 'success') {
                            console.log('Failed to remove team!');
                        }
                    });
                    var temp = this.state.favTeams;
                    const index = temp.findIndex(v => v.TEAM_LONG_NAME === this.state.results[this.state.selPos].TEAM_LONG_NAME);
                    if (index > -1) {
                        temp.splice(index, 1);
                        console.log("spliced");
                    }
                    this.setState({favTeams: temp});
                    this.setState({selPos: undefined});
                    this.setState({rand: 0});
                    
                }
                likeButton.classList.toggle("like-active");
                //console.log(likeButton.classList);
                });
        }

        if (likeButton !== null && !this.state.loaded) {
            this.setState({loaded: true});
            console.log(this.state.favTeams);
            if (this.state.favTeams.some(e => e.TEAM_LONG_NAME === this.state.results[this.state.selPos].TEAM_LONG_NAME)) {
                if (likeButton.classList.value === "like-btn") {
                    //setTimeout(() => {likeButton.classList.toggle("like-active");}, 200);
                    likeButton.classList.toggle("like-active");
                    console.log("toggled");
                }
            } else {
                console.log('reached');
                if (likeButton.classList.value !== "like-btn") {
                    likeButton.classList.toggle("like-active");
                    console.log("toggled");
                }
            }
        }
        //console.log(results);
        //console.log(selPos);
    }

    componentWillUnmount() {
        this.setState({rand: 0});
    }


    updateResults(results) {
        this.setState({results: results});
    }

    updateSel(newSelName, newSelNameLong, newSelNameShort, newSelPos) {
        this.setState({selPos: newSelPos});
        this.setState({selNameLong: newSelNameLong});
        this.setState({selNameShort: newSelNameShort});
        this.setState({pos : 0});
        this.setState({seasonPos: 0});
        this.setState({selName: newSelName});
        getTeamData(newSelName)
        .then(res => {
            this.updateSelData(res.data.stats, res.data.season, res.data.formation); // second should be seldata (matches)
            console.log(res);
            this.setState({posMax: res.data.formation.length});
            this.setState({seasonPosMax: res.data.season.draw.length});
            this.setState({seasonRating: parseInt(res.data.rating)});
            console.log(res.data.rating);
        });
        this.setState({loaded: false});
        // get match histories, split out posMax part and create new state
    }

    updatePos(shift) {

        if (!((this.state.pos + shift > this.state.posMax - 1) || (this.state.pos + shift < 0))) {
            this.setState({pos: this.state.pos + shift});
            this.setState({selPlayerData: undefined});
            this.setState({selPosition: undefined});
        }
        console.log(this.state.pos, this.state.posMax);
    }

    updateSeasonPos(shift) {

        if (!((this.state.seasonPos + shift > this.state.seasonPosMax - 1) || (this.state.seasonPos + shift < 0))) {
            
            console.log(this.state.selName, this.state.seasons[this.state.seasonPos]);
            getFormation(this.state.selName, this.state.seasons[this.state.seasonPos + shift])
            .then(res => {
                if (res.message === 'success') {
                    //var temp = this.state.selSeasonData;
                    this.setState({selData: res.data});
                    this.setState({pos: 0});
                    this.setState({posMax: res.data.length});
                    //this.setState({seasonRating: res.data.rating});
                }
            });
            this.setState({seasonPos: this.state.seasonPos + shift});
        }
        console.log(this.state.seasonPos, this.state.seasonPosMax);
    }

    updateSelData(newStats, newSeason, newData) {
        this.setState({selData: newData});
        console.log(newSeason);
        this.setState({selSeasonData: newSeason});
        this.setState({selStats: newStats});
    }

    updateSelPlayer(player_id, x , y) {
        getPlayerDataId(player_id, this.state.selData[this.state.pos].DATE_PLAYED)
        .then(res => {
            if (res.message === 'success') {
                this.setState({selPlayerData: res.data});
                if (x === 5 && y === 0) { //GK
                    this.setState({selPosition: 'GK'});
                } else if (y <= 3) { // DEFENDER
                    if (x <= 3) {
                        this.setState({selPosition: 'LB'})
                    } else if (x <= 6) {
                        this.setState({selPosition:'CB'})
                    } else {
                        this.setState({selPosition: 'RB'})
                    }
                } else if (y <= 8) { // MIDFIELDER
                    if (x <= 3) {
                        this.setState({selPosition: 'LM'})
                    } else if (x <= 7) {
                        this.setState({selPosition:'CM'})
                    } else {
                        this.setState({selPosition: 'RM'})
                    }
                } else { // STRIKER
                    if (x <= 3) {
                        this.setState({selPosition: 'LF'})
                    } else if (x <= 6) {
                        this.setState({selPosition:'CF'})
                    } else {
                        this.setState({selPosition: 'RF'})
                    }
                }
            }
            console.log(res);
            
        });
    }

    handleSubmit(event) {
        this.setState({searched: true});
        this.setState({rand: 0});
        this.setState({selPos: undefined});
        this.setState({selData: undefined});
        this.setState({selName: undefined});
        this.setState({selName: undefined});
        this.setState({selNameLong: undefined});
        this.setState({selNameShort: undefined});
        this.setState({selSeasonData: undefined});
        this.setState({seasonPos: undefined});
        this.setState({pos: undefined});
        this.setState({posMax: undefined});
        this.setState({seasonPosMax: undefined});
        this.setState({selStats: undefined});
        this.setState({selPlayerData: undefined});
        this.setState({selPosition: undefined});
                //GET TEAM
                getTeams(this.state.searchName)
                .then(res => {
                    if (res.message !== 'success') {
                        console.log(res.err);
                    } else {
                        this.updateResults(res.data);
                        console.log(this.state.results);
                    }
                });
    }
    
    render() {
        var resultVal;
        //console.log(this.state.selData);
        //console.log(this.state.selName);
        //console.log(this.state.selSeasonData);
        if (this.state.selSeasonData === undefined || this.state.selStats === undefined) {
            console.log(this.state.results);
            if (this.state.searchName === undefined) {
                resultVal = <div> 
            <p>Here are your favourited teams, click on one to see detailed Stats!</p>
            <p>Or start a new search above!</p>
            
         </div>
            } else if (!this.state.searched) {
                resultVal = <div><p>Please start a search by clicking the rotating football!</p></div>
            } else {
                resultVal = <div><p>Please select a search result to see detailed Stats!</p></div>
            }
        } else {
            var col;
            var total = this.state.selSeasonData.win[this.state.seasonPos].WIN + this.state.selSeasonData.draw[this.state.seasonPos].DRAW + this.state.selSeasonData.loss[this.state.seasonPos].LOSS;
            //var curr = this.state.selSeasonData[this.state.seasonPos];
            var curr = this.state.selData[this.state.pos];
            var sel = this.state.selPlayerData;
            const noSmoothing = points => {
                let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4);
                for (let i = 1; i < points.length; i++) {
                  d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4);
                }
                return d + 'z';
              };
            const options = {
                size: 120,
                axes: true, // show axes?
                scales: 3, // show scale circles?
                captions: true, // show captions?
                captionMargin: 10,
                dots: false, // show dots?
                zoomDistance: 1.2, // where on the axes are the captions?
                setViewBox: (options) => `-${options.captionMargin * 2} 0 ${options.size + options.captionMargin * 4} ${options.size}`, // custom viewBox ?
                smoothing: noSmoothing, // shape smoothing function
                axisProps: () => ({ className: 'axis' }),
                scaleProps: () => ({ className: 'scale', fill: 'none' }),
                shapeProps: () => ({ className: 'shape' }),
                captionProps: () => ({
                  className: 'caption',
                  textAnchor: 'middle',
                  fontSize: 10,
                  fontFamily: 'sans-serif'
                }),
                dotProps: () => ({
                  className: 'dot',
                  mouseEnter: (dot) => { console.log(dot) },
                  mouseLeave: (dot) => { console.log(dot) }
                })
              };
            const home_data = [
                {x: 5, y: 0, color: 'black', id: curr.HOME_PLAYER_1},
                {x: curr.HOME_PLAYER_X2, y: curr.HOME_PLAYER_Y2, id: curr.HOME_PLAYER_2},
                {x: curr.HOME_PLAYER_X3, y: curr.HOME_PLAYER_Y3, id: curr.HOME_PLAYER_3},
                {x: curr.HOME_PLAYER_X4, y: curr.HOME_PLAYER_Y4, id: curr.HOME_PLAYER_4},
                {x: curr.HOME_PLAYER_X5, y: curr.HOME_PLAYER_Y5, id: curr.HOME_PLAYER_5},
                {x: curr.HOME_PLAYER_X6, y: curr.HOME_PLAYER_Y6, id: curr.HOME_PLAYER_6},
                {x: curr.HOME_PLAYER_X7, y: curr.HOME_PLAYER_Y7, id: curr.HOME_PLAYER_7},
                {x: curr.HOME_PLAYER_X8, y: curr.HOME_PLAYER_Y8, id: curr.HOME_PLAYER_8},
                {x: curr.HOME_PLAYER_X9, y: curr.HOME_PLAYER_Y9, id: curr.HOME_PLAYER_9},
                {x: curr.HOME_PLAYER_X10, y: curr.HOME_PLAYER_Y10, id: curr.HOME_PLAYER_10},
                {x: curr.HOME_PLAYER_X11, y: curr.HOME_PLAYER_Y11, id: curr.HOME_PLAYER_11},
              ];
              const away_data = [
                {x: 5, y: 0, color: 'black', id: curr.AWAY_PLAYER_1},
                {x: curr.AWAY_PLAYER_X2, y: curr.AWAY_PLAYER_Y2, id: curr.AWAY_PLAYER_2},
                {x: curr.AWAY_PLAYER_X3, y: curr.AWAY_PLAYER_Y3, id: curr.AWAY_PLAYER_3},
                {x: curr.AWAY_PLAYER_X4, y: curr.AWAY_PLAYER_Y4, id: curr.AWAY_PLAYER_4},
                {x: curr.AWAY_PLAYER_X5, y: curr.AWAY_PLAYER_Y5, id: curr.AWAY_PLAYER_5},
                {x: curr.AWAY_PLAYER_X6, y: curr.AWAY_PLAYER_Y6, id: curr.AWAY_PLAYER_6},
                {x: curr.AWAY_PLAYER_X7, y: curr.AWAY_PLAYER_Y7, id: curr.AWAY_PLAYER_7},
                {x: curr.AWAY_PLAYER_X8, y: curr.AWAY_PLAYER_Y8, id: curr.AWAY_PLAYER_8},
                {x: curr.AWAY_PLAYER_X9, y: curr.AWAY_PLAYER_Y9, id: curr.AWAY_PLAYER_9},
                {x: curr.AWAY_PLAYER_X10, y: curr.AWAY_PLAYER_Y10, id: curr.AWAY_PLAYER_10},
                {x: curr.AWAY_PLAYER_X11, y: curr.AWAY_PLAYER_Y11, id: curr.AWAY_PLAYER_11},
              ];

            var spiderChart;
            if (this.state.selPosition === 'LB' || this.state.selPosition === 'CB' || this.state.selPosition === 'RB') {
                spiderChart =
                <RadarChart
                captions={{
                    prop1: 'Interceptions',
                    prop2: 'Marking',
                    prop3: 'Slid. Tackle',
                    prop4: 'Stand. Tackle',
                    prop5: 'Strength',
                    prop6: 'Long Pass',
                    prop7: 'Short Pass'
                }}
                data={[
                    {
                    data: {
                        prop1: `${sel.INTERCEPTIONS}`/100,
                        prop2: `${sel.MARKING}`/100,
                        prop3: `${sel.SLIDING_TACKLE}`/100,
                        prop4: `${sel.STANDING_TACKLE}`/100,
                        prop5: `${sel.STRENGTH}`/100,
                        prop6: `${sel.LONG_PASSING}`/100,
                        prop7: `${sel.SHORT_PASSING}`/100
                    },
                    meta: { color: 'red' }
                    }
                ]}
                size = {130}
                options = {options}
                
            />
            } else if (this.state.selPosition === 'LM' || this.state.selPosition === 'CM' || this.state.selPosition === 'RM') {
                spiderChart =
                <RadarChart
                captions={{
                    prop1: 'Vision',
                    prop2: 'Crossing',
                    prop3: 'Acceleration',
                    prop4: 'Sprint Speed',
                    prop5: 'Stamina',
                    prop6: 'Long Pass',
                    prop7: 'Short Pass'
                }}
                data={[
                    {
                    data: {
                        prop1: `${sel.VISION}`/100,
                        prop2: `${sel.CROSSING}`/100,
                        prop3: `${sel.ACCELERATION}`/100,
                        prop4: `${sel.SPRINT_SPEED}`/100,
                        prop5: `${sel.STAMINA}`/100,
                        prop6: `${sel.LONG_PASSING}`/100,
                        prop7: `${sel.SHORT_PASSING}`/100
                    },
                    meta: { color: 'red' }
                    }
                ]}
                size = {130}
                options = {options}
                
            />
            } else if(this.state.selPosition === 'LF' || this.state.selPosition === 'CF' || this.state.selPosition === 'RF') {
                spiderChart =
                <RadarChart
                captions={{
                    prop1: 'Finishing',
                    prop2: 'Volleys',
                    prop3: 'Heading',
                    prop4: 'Dribbling',
                    prop5: 'Ball Control',
                    prop6: 'Long Shots',
                    prop7: 'Penalties'
                }}
                captionMargin = {10}
                data={[
                    {
                    data: {
                        prop1: `${sel.FINISHING}`/100,
                        prop2: `${sel.VOLLEYS}`/100,
                        prop3: `${sel.DRIBBLING}`/100,
                        prop4: `${sel.HEADING_ACCURACY}`/100,
                        prop5: `${sel.BALL_CONTROL}`/100,
                        prop6: `${sel.LONG_SHOTS}`/100,
                        prop7: `${sel.PENALTIES}`/100
                    },
                    meta: { color: 'red' }
                    }
                ]}
                size = {130}
                options = {options}
            />
            } else if(this.state.selPosition === 'GK') {
                spiderChart =
                <RadarChart
                captions={{
                    prop1: 'Reactions',
                    prop2: 'Diving',
                    prop3: 'Handling',
                    prop4: 'Kicking',
                    prop5: 'Positioning',
                    prop6: 'Jumping',
                    prop7: 'Agility'
                }}
                data={[
                    {
                    data: {
                        prop1: `${sel.REACTIONS}`/100,
                        prop2: `${sel.GK_DIVING}`/100,
                        prop3: `${sel.GK_HANDLING}`/100,
                        prop4: `${sel.GK_KICKING}`/100,
                        prop5: `${sel.GK_POSITIONING}`/100,
                        prop6: `${sel.JUMPING}`/100,
                        prop7: `${sel.AGILITY}`/100
                    },
                    meta: { color: 'red' }
                    }
                ]}
                size = {130}
                options = {options}
                
            />
            } else {
                spiderChart = <div></div>;
            }
          
                                               
            // STEP1: REWRITE QUERIES SLIGHTLY TO GET OVERALL RATING, WIN %, STATS FOR EACH SEASON, RETURN ALL OF THESE WHEN TEAM IS SELECTED AND ALLOW
            // USERS TO MOVE FORWARD AND BACKWARD BETWEEN SEASONS (ADV: SAME AS PLAYER SEARCH)
            // STEP2: WRITE QUERY TO GET MATCH DATA OF PLAYER LOCATIONS X AND Y COORDINATES FOR HOME AND AWAY GAMES (HOME_PLAYER_1_X, AWAY_PLAYER_1_X) RESPECTIVELY
            // VISUALIZE THESE AS FORMATION

            //LIKELY NEED TO ADD .OVERALL_RATING after array when Query implemented depending on server implmentation
            if (this.state.selSeasonData.OVERALL_RATING[this.state.seasonPos] < 65) {
            col = 'linear-gradient(90deg,#b08d57 0%, #804a00 100%)';
            } else if (this.state.selSeasonData.OVERALL_RATING[this.state.seasonPos] > 64 && this.state.selSeasonData.OVERALL_RATING[this.state.seasonPos] < 75) {
            col = 'linear-gradient(90deg,#d3d3d3 0%, #363838 100%)';
            } else if (this.state.selSeasonData.OVERALL_RATING[this.state.seasonPos] > 75) {
            col = 'radial-gradient(#ffdf00, #d4af37, #ffd700)';
            }
            resultVal = 
            <div className = "teamMainContainer">
                <div className="teamItem" >
                <div className = "teamStats">
                    <ul>
                        <li className = "teamName">{this.state.selNameLong}</li>
                        <li className = "teamDate">{this.state.selNameShort}             Selected Season: {this.state.seasons[this.state.seasonPos]}</li>
                    </ul>
                </div>
                <div className = "likeContainer">
                    <span class="like-btn" id = 'like-btn'></span>
                </div>
                <div className = "teamButtons">
                
                    <div className = "Ttexts" style = {{'font-size': '10px'}}>
                    {this.state.seasonPos === (this.state.seasonPosMax - 1) &&
                        'No earlier season available.'
                    }
                    </div>
                
                <div className = "Tbuttons">
                <div class="Scenter-con" onClick = {() => this.updateSeasonPos(1)}>
                        <div class="round" style = {{'transform' : 'rotate(180deg)'}}>
                            <div className="cta">
                                <span class="arrow primera next "></span>
                                <span class="arrow segunda next "></span>
                            </div>
                        </div>
                </div>
                <div class="Scenter-con" onClick = {() => this.updateSeasonPos(-1)}>
                        <div class="round">
                            <div className="cta">
                                <span class="arrow primera next "></span>
                                <span class="arrow segunda next "></span>
                            </div>
                        </div>
                </div>
                </div>
                
                    <div className = "Ttexts" style = {{'font-size': '10px'}}>
                    {this.state.seasonPos === 0 &&
                        'No later season available.'
                    }
                    </div>
                
                
                    </div> 
               
               <div className="teamRating" style = {{'background': col}}>
                    {this.state.results[this.state.selPos].OVERALL_RATING}
               </div>
               </div>
                <div className="teamData">
                    <table className="teamTable">
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
                            <th>Season</th>
                            <th></th>
                            <th>Stats Overall</th>
                            <th></th>
                            <th>Stats Season</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Win %:</td>
                            <td>{this.state.selStats.win}</td>
                            <td>Win %: </td>
                            <td>{parseInt(this.state.selSeasonData.win[this.state.seasonPos].WIN / total * 100)}</td>
                            <td>Goals Scored:</td>
                            <td>{this.state.selStats.goals_scored}</td>
                            <td>Goals Scored:</td>
                            <td>{parseInt(this.state.selSeasonData.goals_scored[this.state.seasonPos].AVERAGE_GOALS * 100) / 100}</td>
                        </tr>
                        <tr>
                            <td>Draw %:</td>
                            <td>{this.state.selStats.draw}</td>
                            <td>Draw %: </td>
                            <td>{parseInt(this.state.selSeasonData.draw[this.state.seasonPos].DRAW / total * 100)}</td>
                            <td>Goals Conceded:</td>
                            <td>{this.state.selStats.goals_conceded}</td>
                            <td>Goals Conceded:</td>
                            <td>{parseInt(this.state.selSeasonData.goals_conceded[this.state.seasonPos].AVERAGE_GOALS * 100) / 100}</td>
                        </tr>
                        <tr>
                            <td>Loss %: </td>
                            <td>{this.state.selStats.loss}</td>
                            <td>Loss %: </td>
                            <td>{parseInt(this.state.selSeasonData.loss[this.state.seasonPos].LOSS / total * 100)}</td>
                            <td>Games Played:</td>
                            <td>NA</td>
                            <td>Games Played:</td>
                            <td>{total}</td>
                        </tr>
                        </tbody>
                        
                    </table>
                </div>
                <div className = "teamContainer">
                <div className = "teamButtons">
                
                    <div className = "Ttexts">
                    {this.state.pos === (this.state.posMax - 1) &&
                        'No later match available.'
                    }
                    </div>
                
                <div className = "Tbuttons">
                <div class="center-con" onClick = {() => this.updatePos(-1)}>
                        <div class="round" style = {{'transform' : 'rotate(180deg)'}}>
                            <div className="cta">
                                <span class="arrow primera next "></span>
                                <span class="arrow segunda next "></span>
                            </div>
                        </div>
                </div>
                <div class="center-con" onClick = {() => this.updatePos(1)}>
                        <div class="round">
                            <div className="cta">
                                <span class="arrow primera next "></span>
                                <span class="arrow segunda next "></span>
                            </div>
                        </div>
                </div>
                </div>
                
                    <div className = "Ttexts">
                    {this.state.pos === 0 &&
                        'No earlier match available.'
                    }
                    </div>
                
                
                    </div> 
                    <div className  = "matchContainer">
                        <div className = "matchTitle">
                            <div className = "teamsTitle">
                                <div className = "boxTitle">
                                    {curr.HOME_TEAM_NAME}
                                </div>
                                <div className = "scoreTitle">
                                    {curr.HOME_TEAM_GOAL} - {curr.AWAY_TEAM_GOAL}
                                </div>
                                <div className = "boxTitle">
                                    {curr.AWAY_TEAM_NAME}
                                </div>
                            </div>
                            <div className = "infoTitle">
                                {curr.COUNTRY_NAME}'s League, Matchday {curr.STAGE}, {new Date(curr.DATE_PLAYED).getDate()}.{new Date(curr.DATE_PLAYED).getMonth() + 1}.{new Date(curr.DATE_PLAYED).getFullYear()}
                            </div>
                        </div>

                        <div className = "matchData">
                                <div className = "pitch" id='homePitch'>
                                    <XYPlot height={190} width={150} style={{'margin-top': '30px'}}>
                                        <MarkSeries colorType = 'literal' data={home_data} onValueClick={(datapoint, event) => {
                                            this.updateSelPlayer(datapoint.id, datapoint.x, datapoint.y);
                                            datapoint.color = 'blue';
                                            console.log(home_data);
                                            this.forceUpdate();
                                            this.render()}}/>
                                    </XYPlot>
                                </div>
                                <div className = "dataView">
                                    {this.state.selPlayerData !== undefined && 
                                        <div className = "dataViewContainer">
                                            <div className = "dataTitle">
                                                <p>{this.state.selPlayerData.PLAYER_NAME}</p>
                                                <p style={{'fontStyle': 'italic', 'font-size':'small'}}>(Eval: {new Date(this.state.selPlayerData.DATE_EVALUATED).getDate()}.{new Date(this.state.selPlayerData.DATE_EVALUATED).getMonth()+1}.{new Date(this.state.selPlayerData.DATE_EVALUATED).getFullYear()})</p>
                                            </div>
                                            <div className = "dataData">
                                                {spiderChart}        
                                                <div class="position">
                                                    Position: {this.state.selPosition}
                                                </div>
                                            </div>
                                        </div>
                                        
                                    }
                                </div>
                                <div className = "pitch">
                                    <XYPlot height={190} width={150} style={{'margin-top': '30px'}}>
                                        <MarkSeries colorType = 'literal' data={away_data} onValueClick={(datapoint, event) => {
                                            datapoint.color='blue';
                                            this.updateSelPlayer(datapoint.id, datapoint.x, datapoint.y);
                                            }}/>
                                    </XYPlot>
                                </div>
                        </div>
                    </div>
                
                </div>
            </div>
        }
        //<PlayerItem pane = 'result' name = {this.state.selName} date = {this.state.selData[this.state.pos].BIRTHYEAR} evalDate = {this.state.selData[this.state.pos].DATE_EVALUATED} rating = {this.state.selData[this.state.pos].OVERALL_RATING}/>
            
        
        return (

            <div >
                <InnerTopNavBar></InnerTopNavBar>
                <div className="Teams">
                    
                    <div className="teamSearch">
                        
                        <div className="teamSearchBar">
                            <div className="form__group field">
                            <input type="input" className="form__field" placeholder="Search for a Team Name ..." name="name" id='name' onChange={this.handleNewSearchTyped} required />
                            <label htmlFor="name" className="form__label">Team Name</label>
                            </div>
                        <div>
                        <button className="submit" onClick= {this.handleSubmit}> 
                            <img src={logo} className="Player-logo" alt="logo" />
                        </button>
                        </div>
                        
                        </div> 
                    </div>
                    
                    <div className="teamPane">
                        <ScrollView style={{height: '100%'}}>
                        {this.state.results.map((item, i) => (
                                    //<div onClick = {this.props.updateReceiver(item.firstname)}>
                                    <div>
                                        {this.state.selPos !== i &&
                                        <div className="teamItem" key = {item.TEAM_API_ID} style = {{cursor: 'pointer'}} onClick={() => {this.updateSel(item.TEAM_API_ID, item.TEAM_LONG_NAME, item.TEAM_SHORT_NAME, i)}}>
                                            <div className = "teamStats">
                                                <ul>
                                                    <li className = "teamName">{item.TEAM_LONG_NAME}</li>
                                                    <li className = "teamDate"> {item.TEAM_SHORT_NAME}</li>
                                                </ul>
                                            </div>
                                            {item.OVERALL_RATING < 65 &&
                                                <div className="teamRating" style = {{'background': 'linear-gradient(90deg,#b08d57 0%, #804a00 100%)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                            {(item.OVERALL_RATING > 64 && item.OVERALL_RATING < 75) &&
                                                <div className="teamRating" style = {{'background': 'linear-gradient(90deg,#d3d3d3 0%, #363838 100%)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                            {item.OVERALL_RATING > 74 &&
                                                <div className="teamRating" style = {{'background': 'radial-gradient(#ffdf00, #d4af37, #ffd700)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                        </div>
                                        }
                                        {this.state.selPos === i &&
                                        <div className="teamItem" key = {item.ID} style = {{cursor: 'pointer', 'background-color': 'rgba(165, 176, 173, 0.8)'}}>
                                            <div className = "teamStats">
                                                <ul>
                                                <li className = "teamName">{item.TEAM_LONG_NAME}</li>    
                                                <li className = "teamDate"> {item.TEAM_SHORT_NAME}</li>
                                                </ul>
                                            </div>
                                            
                                            {item.OVERALL_RATING < 65 &&
                                                <div className="teamRating" style = {{'background': 'linear-gradient(90deg,#b08d57 0%, #804a00 100%)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                            {(item.OVERALL_RATING > 64 && item.OVERALL_RATING < 75) &&
                                                <div className="teamRating" style = {{'background-color': 'linear-gradient(90deg,#d3d3d3 0%, #363838 100%)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                            {item.OVERALL_RATING > 74 &&
                                                <div className="teamRating" style = {{'background': 'radial-gradient(#ffdf00, #d4af37, #ffd700)'}}>
                                                    {item.OVERALL_RATING}
                                                </div>
                                            }
                                        </div>
                                        }

                                    </div>

                        ))}
                        </ScrollView>
                    </div>
                            
                    <div className="teamResultsPane">
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