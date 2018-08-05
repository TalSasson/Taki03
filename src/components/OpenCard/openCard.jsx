import React from 'react';
import ReactDOM from 'react-dom';
import "./openCard.css";
import Card from '../Card/card.jsx';


export default class OpenCard extends React.Component {

    render(){
        return(
            <div className="openCards">
                {this.renderCard()}
            </div>
        );
    }

    renderCard() {
        const openCardSrc = this.getCardSrc(this.props.card);
        return (
            <Card src={openCardSrc} onCardClickFunc={()=>{}}/>
        )
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