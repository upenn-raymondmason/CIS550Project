import React from 'react';
import '../styles/Player.css'
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'

export default class ResultItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: props.name,
            date: props.date,
            rating: props.rating,
            width: 0, 
            height: 0
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    // 3 functions below for spider graph resizing: using width and height from constructor
    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

        // Each data item is one of the color inputs
        const inputData = [
          {
            data: {
              ball_control: 0.7,
              finishing: .8,
              dribbling: 0.9,
              sprint_speed: 0.67,
              strength: 0.8,
              long_passing: 0.6,
              short_passing: 0.4
            },
            meta: { color: 'blue' }
          },
          {
            data: {
              ball_control: 0.6,
              finishing: .85,
              dribbling: 0.5,
              sprint_speed: 0.6,
              strength: 0.7,
              long_passing: 0.9,
              short_passing: 0.7
            },
            meta: { color: 'red' }
          }
        ];
        
        // Defining each corner of the spider chart
        const inputCaptions = {
          ball_control: 'Ball Control',
          finishing: 'Finishing',
          dribbling: 'Dribbling',
          sprint_speed: 'Spring Speed',
          strength: 'Strength',
          long_passing: 'Long Pass',
          short_passing: 'Short Pass'
        };

        return (
            <div>
                <div className="playerItem">
                    <div className = "playerStats">
                        <ul>
                            <li className = "playerName">{this.state.name}</li>
                            <li className = "playerDate">Born: {this.state.date}</li>
                        </ul>
                    </div>
                   
                   <div className="playerRating">
                        {this.state.rating}
                   </div>
                </div>
                <RadarChart
                    captions={inputCaptions}
                    data={inputData}
                    size={this.state.width / 4}
                />
                <div class="SpiderGraphLegend">
                    <div className = "redRectangle"/>
                    <p className = "legendText"> Lionel Messi </p>
                    <div className = "blueRectangle" />
                    <p className = "legendText"> Average Player</p>
                </div>
            </div>
        )
    }
}