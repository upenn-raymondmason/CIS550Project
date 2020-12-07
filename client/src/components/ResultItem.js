import React from 'react';
import '../styles/Player.css'
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'

export default class ResultItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0, 
            height: 0,
            inputData:  [
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
                  ball_control: props.ball_control/100,
                  finishing: props.finishing/100,
                  dribbling: props.dribbling/100,
                  sprint_speed: props.sprint_speed/100,
                  strength: props.strength/100,
                  long_passing: props.long_passing/100,
                  short_passing: props.short_passing/100
                },
                meta: { color: 'red' }
              }
            ]
        };
        this.update = props.func;
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    

    // 3 functions below for spider graph resizing: using width and height from constructor
    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      this.update(3);
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        
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
                <RadarChart
                    captions={inputCaptions}
                    data={this.state.inputData}
                    size={this.state.width / 6}
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