import logo from '../resources/logo.svg';
import '../styles/OuterPages.css';
import '../styles/Player.css';
import TopNavBar from '../components/TopNavBar';
import React from 'react'
import Select from 'react-select'
import AreaChart from '../components/AreaChart'
import { getSeasonData } from '../fetcher';

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

export default class About extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
        results: [],
        country: undefined,
    }
    this.updateResults = this.updateResults.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewAttrSelected = this.handleNewAttrSelected.bind(this);
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
    var array = ['Manchester City', "Liverpool"];
    for (var i = 0; i < array.length; i++) {
        getSeasonData('England', array[i])
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
        });

    }
  };

  render() {

    return (
      <div data-testid="AboutBox" id="AboutBox" className="App">
        <TopNavBar></TopNavBar>
        <br></br>
        <h1>About</h1>
        <img src={logo} className="App-logo" alt="logo" />
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
        <button className="submit" onClick= {this.handleSubmit}> 
            <img src={logo} className="Player-logo" alt="logo" />
        </button>
        <div class="horizontalContainer">
            <div class="checkBoxes">
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