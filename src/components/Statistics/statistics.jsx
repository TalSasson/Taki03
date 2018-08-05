import React from 'react';
import ReactDOM from 'react-dom';
import "./statistics.css";


export default class Statistics extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
    }

    componentWillUnmount(){
    }

    render(){

        return(
            <div className="statistics">
                <div className="timerDisplay item">Time elapsed: {this.setTime()}</div>
                <div className="turnsCount item">Total moves: {this.getTurnCount()}</div>
                <div className="avgTurnTime item">Avg turn time: {this.setAvg()} sec</div>
                <div className="countLastCard item">Reached last card: {this.getReacheLastCard()}</div>
            </div>
        );
    }

    setTime(){
        let timeInSec;
        let sec, min, minString, secString;
        if(this.props.isEndGame){
            // if isEndGame === true then we take the start game time from any user
            timeInSec =  Math.round(((new Date()).getTime() / 1000)) - this.props.info[0].timeElapsedInSec;
        }
        else{
            // else, we take the start game time from specific user
            timeInSec =  Math.round(((new Date()).getTime() / 1000)) - this.props.info.timeElapsedInSec;
        }

        min =  Math.floor(timeInSec/60);
        sec = timeInSec - min*60;

        minString = min < 10 ? ("0" + min) : min;
        secString = sec < 10 ? ("0" + sec) : sec;
        return (minString + ':' + secString);
    }

    setAvg(){
        const {info} = this.props;
        let avg;
        if(this.props.isEndGame){
            // if isEndGame === true, then avg is start game timr from any user / the total turns of all users
            avg = (Math.round(((new Date()).getTime() / 1000)) - this.props.info[0].timeElapsedInSec) / this.getTurnCount();
            avg = avg.toFixed(2);
            return avg;
        }
        else{
            if(info.turnCount === 0)
                return "00.00"
            else{
                avg = info.totalTurnsTime / info.turnCount;
                avg = avg.toFixed(2);
                return avg;
            }
        }
    }

    getTurnCount(){
        //if isEndGame === true, info is an array of all the usersStatistics.
        //else, info is statistics of one user
        const {info} = this.props;
        if(this.props.isEndGame){
            let i, totalTurns;
            for (i=0, totalTurns=0 ; i<info.length; i++){
                totalTurns += info[i].turnCount;
            }
            return totalTurns;
        }
        else{
            return info.turnCount;
        }
    }

    getReacheLastCard(){
        const {info} = this.props;
        if(this.props.isEndGame){
            let i, lastCardCount;

            for (i=0, lastCardCount=0 ; i<info.length; i++){
                lastCardCount += info[i].lastCardCount;
            }
            return lastCardCount;
        }
        else{
            return info.lastCardCount;
        }
    }
}