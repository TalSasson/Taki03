import React from 'react';
import ReactDOM from 'react-dom';
import "./playerStack.css";
import Card from '../Card/card.jsx';
import arrowImage from '../resources/arrow.png';


export default class PlayerStack extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            cardsArrLength: 0,
            onCardClickFunc: props.onCardClickFunc
        };

    }

    componentWillMount(){
    }

    componentWillReceiveProps(nextProps){
        if(this.props.onCardClickFunc !== nextProps.onCardClickFunc || (this.props.isEnable !== nextProps.isEnable)){
            this.setState({ onCardClickFunc: nextProps.onCardClickFunc, isEnable: nextProps.isEnable});
        }
    }

    render() {
        const isEnable = this.props.isEnable || (this.props.cards.length===0);
        return (
            <div className={isEnable ? "player wrapper" : "player wrapper disabled"} id={this.props.id}>
                <div className={this.props.nameOfClass !== "" ? "stackWrapper currPlayer": "stackWrapper"}>               
                        {this.renderCards()}  
                        {this.renderArrow()}
                        {this.renderName()}
                        {this.renderBackToLobbyBtn()}
                </div>           
            </div>
        );
    }

    renderCards() {
        const srcCardBack = "./cards/card_back.png";
        let logicCard, i;


        return ( 
            this.props.cards.map((logicCard, i) => 
                <div key={i}>
                    <Card 
                        src={this.props.id === this.props.getCurrUserId() ? this.getCardSrc(logicCard) : srcCardBack}
                        onCardClickFunc={this.props.id === this.props.getCurrUserId() ? this.state.onCardClickFunc : ()=>{}}
                        numOfPlayers = {this.props.numOfPlayers}
                    />
                </div>
            )
        )
    }

    renderArrow(){
        if(this.props.showArrow){
            return <img className="arrowImage" src={arrowImage}/>
        }
    }
    renderName(){
        return (<div className="nameOfPlayer"> {this.props.name} </div>)
    }

    renderBackToLobbyBtn(){
        if(this.props.id === this.props.getCurrUserId() && this.props.cards.length === 0 && this.props.id !== this.props.userTurnNumber){
            return(
                <div className="btnBTLWrapper">
                    <div onClick={this.props.backToLobby}>
                        Back To Lobby
                    </div>
                </div>
            );
        }
    }

    getCardSrc(logicCard){
        let res;

        if(logicCard.name === "taki_colorful" && logicCard.color)
            res = "./cards/taki";
        else
            res = "./cards/" + logicCard.name;

        if(logicCard.color)
            res += "_" + logicCard.color;
        res += ".png";
        
        return res;
    }
}