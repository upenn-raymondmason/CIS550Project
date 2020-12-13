import logo from '../resources/logo.svg';
import '../styles/OuterPages.css';
import '../styles/Player.css';
import InnerTopNavBar from '../components/InnerTopNavBar';
import React from 'react'
import Select from 'react-select'
import AreaChart from '../components/AreaChart'
import { getSeasonData, getTeamsCountry } from '../fetcher';
import {ScrollView} from '@cantonjs/react-scroll-view';

const countries = [
    { value: 'England', label: 'England'},
    { value: 'Spain', label: 'Spain'},
    { value: 'France', label: 'France'},
    { value: 'Germany', label: 'Germany'},
    { value: 'Italy', label: 'Italy'},
    { value: 'Netherlands', label: 'Netherlands'},
    { value: 'Poland', label: 'Poland'},
    { value: 'Portugal', label: 'Portugal'},
    { value: 'Scotland', label: 'Scotland'},
    { value: 'Switzerland', label: 'Switzerland'}
];

export default class League extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
        results: [],
        checkboxes: [],
        checkedTeams: [],
        country: undefined,
    }
    this.updateResults = this.updateResults.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadTeamsInCountry = this.loadTeamsInCountry.bind(this);
    this.updateTeams = this.updateTeams.bind(this);
    this.handleNewAttrSelected = this.handleNewAttrSelected.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.uncheckElements = this.uncheckElements.bind(this);
  }

  updateResults(results) {
    var data = [];
    var legendTitle = results[0].TEAM_LONG_NAME;
    data = results.map((item)=> {
        return {x: new Date(parseInt(item.SEASON.substring(0, 4)), 0), y: item.TOTAL_GOALS};
    });
    var dataLine = {
        type: "area",
        name: legendTitle,
        showInLegend: legendTitle,
        xValueFormatString: "YYYY",
        yValueFormatString: "##",
        dataPoints: data
    };
    this.setState({
        results: this.state.results.concat(dataLine)
    });
  }

  handleSubmit(event) {
    if (this.state.country === undefined) {
        return;
    }
    this.setState({
        results: [],
    });

    // replace with checked boxes
    var array = this.state.checkedTeams;
    for (var i = 0; i < array.length; i++) {
        // replace with country
        getSeasonData(this.state.country, array[i])
            .then(res => {
            if (res.message !== 'success') {
                console.log(res.err);
            } else {
                this.updateResults(res.data);
            }
        });
    }
  }

  handleNewAttrSelected(valueArr) {
    if (valueArr === null) {
        this.setState({
            country: undefined
        });
    } else {
        this.setState({
            country: valueArr.value,
            checkedTeams: [],
        }, () => {                              
            //callback
            this.loadTeamsInCountry();
            this.uncheckElements();
        });
    }
  };

  loadTeamsInCountry() {
    console.log(this.state.country);
    getTeamsCountry(this.state.country)
        .then(res => {
        if (res.message !== 'success') {
            console.log(res.err);
        } else {
            this.updateTeams(res.data);
        }
    });
  };

  updateTeams(results) {
    var data = results.map((item)=> {
        return item.TEAM_LONG_NAME;
    });
    this.setState({
        checkboxes: data,
    });
  };

  handleCheckboxChange(team, e) {
    if (e.target.checked) {
        this.setState({
            checkedTeams: this.state.checkedTeams.concat(team)
        });
    } else {
        this.setState(prevState => ({
            checkedTeams: prevState.checkedTeams.filter(el => el != team)
        }));
    }
    console.log(this.state.checkedTeams);
  }
  
  uncheckElements() {
    var uncheck=document.getElementsByTagName('input');
    for(var i=0;i<uncheck.length;i++)
    {
        if(uncheck[i].type=='checkbox')
        {
            uncheck[i].checked=false;
        }
    }
  }

  render() {

    return (
      <div className="App">
        <InnerTopNavBar></InnerTopNavBar>
        <br></br>
        <div className = 'profileTitle' style = {{'margin-bottom':'20px', opacity: 0.7}}>
            <div className = 'titleContainer'>
              <p style = {{'fontWeight': 'bold'}}>Team Stats by League</p>
              <p style = {{'fontStyle':'italic', 'font-size': '18px'}}>Select a country and view goals scored by each team across the seasons!</p>
           </div>
          </div>
        <img src={logo} className="App-logo" alt="logo" />
        <div class="horizontalContainerSearch">
            <div class="SearchBox">
                <Select
                    isClearable
                    isSearchable
                    
                    onChange={this.handleNewAttrSelected}
                    className="selector"
                    name="color"
                    options={countries}
                    
                    style={{width: '25%'}}
                />
            </div>
            <div>
                <button className="button" onClick={this.handleSubmit}> Graph Teams </button>
            </div>
        </div>
        <div class="horizontalContainer">
            <div class="checkBoxes">
                <ScrollView style={{height: '100%'}}>
                    <div class="teams"> Teams in League </div>
                {
                    this.state.checkboxes.map((item, i) => (
                        <div>
                            <div class="checkbox">
                                <div class="teamLabel"> {item} </div>
                                <label>
                                  <input class="box" type="checkbox" onChange={(e) => this.handleCheckboxChange(item, e)} /> 
                                </label>
                            </div>
                            <div class="divider"/>
                        </div>
                    ))
                }
                </ScrollView>
            </div>
            <div class="AreaChart">
                <AreaChart results={this.state.results}> </AreaChart>
            </div> 
        </div>
        </div>
    );
  }
}

//<img src={logo} className="App-logo" alt="logo" />