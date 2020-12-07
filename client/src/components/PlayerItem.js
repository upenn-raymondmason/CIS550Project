import React from 'react';
import '../styles/Player.css'

export default class PlayerItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: props.name,
            date: props.date,
            rating: props.rating,
            evalYear: new Date(props.evalDate).getFullYear(),
            evalMonth: new Date(props.evalDate).getMonth(),
            pane: props.pane
        }
    }

    handleContactClick() {
        console.log('Implement handle!')
    }

    render() {
        var dateli;
        if (this.state.pane === 'search') {
            dateli = <li className = "playerDate">Born: {this.state.date} Last Eval: {this.state.evalMonth}.{this.state.evalYear}</li>
        } else {
            dateli = <li className = "playerDate">Born: {this.state.date} Selected Eval: {this.state.evalMonth}.{this.state.evalYear}</li>
        }
        var col;
        if (this.state.rating < 65) {
            col = '#804A00';
        } else if (this.state.rating > 64 && this.state.rating < 75) {
            col = '#BEC2CB';
        } else if (this.state.rating > 75) {
            col = '#FFD700';
        }

       return (
            <div className="playerItem" >
                <div className = "playerStats">
                    <ul>
                        <li className = "playerName">{this.state.name}</li>
                        {dateli}
                    </ul>
                </div>
               
               <div className="playerRating" style = {{'background-color': col}}>
                    {this.state.rating}
               </div>
            </div>
        )
    }
}