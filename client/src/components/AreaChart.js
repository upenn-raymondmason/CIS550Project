import React from 'react';
import '../styles/Player.css';

import CanvasJSReact from '../canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class AreaChart extends React.Component {
  constructor(props) {
    super();
    this.state = {
      results: props.results
    }
    this.toggleDataSeries = this.toggleDataSeries.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.results);
    this.setState({ results: nextProps.results });  
  }

  toggleDataSeries(e){
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    }
    else{
      e.dataSeries.visible = true;
    }
    this.chart.render();
  }

  render() {

    const options = {
      theme: "light2",
      backgroundColor: '#D1D6C300',
      title: {
        text: "Goals Per Season"
      },
      subtitles: [{
        text: ""
      }],
      axisY: {
        prefix: ""
      },
      toolTip: {
        shared: true
      },
      data: this.state.results
    }
    return (
      <div>
        <CanvasJSChart options = {options}
           onRef={ref => this.chart = ref}
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}