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
        }
    }

    handleContactClick() {
        console.log('Implement handle!')
    }

    render() {
       return (
            <div className="playerItem" >
                <div className = "playerStats">
                    <ul>
                        <li className = "playerName">{this.state.name}</li>
                        <li className = "playerDate">Born: {this.state.date} Last Eval: {this.state.evalMonth}.{this.state.evalYear}</li>
                    </ul>
                </div>
               
               <div className="playerRating">
                    {this.state.rating}
               </div>
            </div>
        )
    }
}