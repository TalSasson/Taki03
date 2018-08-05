import React from 'react';
import ReactDOM from 'react-dom';
import "./middle.css";
import Card from '../Card/card.jsx';
import OpenCard from '../OpenCard/openCard.jsx';
import Statistics from '../Statistics/statistics.jsx';
import Deck from '../Deck/deck.jsx';


export default class Middle extends React.Component {

    render(){

        return(
            <div className="middleWrapper wrapper">
                <div className="openChatWrapper">
                    <div className="openChatBtn" onClick={this.props.openChat}>
                        <span>Open Chat</span>
                    </div>
                </div>
                <div className="statisticsWrapper">
                    <Statistics isEndGame={false} info={this.props.statistics}/>
                </div>

                <OpenCard card={this.props.openCard}/>

                <Deck onDeckClickFunc={this.props.onDeckClickFunc} deckCardsCount={this.props.deckCardsCount}/>
            </div>
        );

    }

    openChat(event){
        this.props.openChat(userName)
    }
}