import React from 'react';
import ReactDOM from 'react-dom';
import "./card.css";

export default class Card extends React.Component {
    
    render() {
         
        return (
            <div className="cardContainer" onClick={this.onCardClick.bind(this)}>
                <div className={this.props.numOfPlayers > 2 ? "moreThan2Players card" : "card"}>
                    <img src={this.props.src}/>
                </div> 
            </div>
        );
    }

    onCardClick(event){
        this.props.onCardClickFunc(event.target.src);
    }

}