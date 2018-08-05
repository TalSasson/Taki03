import React from 'react';
import ReactDOM from 'react-dom';
import "./endGame.css";
import Statistics from '../Statistics/statistics.jsx';



export default class EndGame extends React.Component {

    componentDidMount(){
        this.props.stopFetchCurrGame();
    }

    render(){
        return(
            <div className="endGame">
                <div className="winner">The Winner is {this.props.winner}</div>
                <div className="winner">The Loser is {this.props.loser}</div>
                <Statistics info={this.props.statistics} isEndGame={true}/> 
                <div className="btnWrapper">
                    <div onClick={this.props.backToLobby}>
                        Back To Lobby
                    </div>
                </div>
            </div>
        );
    }
}