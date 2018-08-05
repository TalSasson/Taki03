import React from 'react';
import ReactDOM from 'react-dom';
import PlayerStack from '../PlayerStack/playerStack.jsx';
import Middle from '../Middle/middle.jsx';
import ChangeColor from '../ChangeColor/changeColor.jsx';
import Warning from '../Warning/warning.jsx';
import EndGame from '../EndGame/endGame.jsx';
import ChatContainer from '../chatContainer.jsx';
import "./gameBoard.css"


export default class GameBoard extends React.Component {

    constructor(props) {
        super(props);
        this.currUser= this.props.userDetails;
        this.state = {
            currGame: {},
            isShowChat: false
        };

        this.getCurrGame = this.getCurrGame.bind(this);
        this.onCardClickFunc = this.onCardClickFunc.bind(this)
        this.onDeckClickFunc = this.onDeckClickFunc.bind(this)
        this.stopFetchCurrGame = this.stopFetchCurrGame.bind(this);
        this.openChat = this.openChat.bind(this);
        this.backToGame = this.backToGame.bind(this);
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    componentDidMount() {
        this.getCurrGame().catch(() => console.log("ERROR !!"));
    }

    stopFetchCurrGame(){
        if(this.state.currGame.gameLogic.isEndGameScreenActive && this.timeoutId){
            clearTimeout(this.timeoutId);
        }
    }


    getCurrGame() {
        return fetch(`/rooms/gameById/?id=${this.props.roomDetails.id}`, { method: 'GET', credentials: 'include' })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getCurrGame, 250);
                return response.json();
            })
            .then((currGame) => currGame && this.setState({currGame: currGame}))

            .catch(err => { throw err });
    }

    render() {
        const {currGame} = this.state;
        if(currGame.gameLogic){
            if(this.state.isShowChat)
                return (<ChatContainer backToGame={this.backToGame}/>);
            
            return (
                <div className="boardWrapper">
                    <div className={this.isColorChoiseVisible() ? "blurScreen stackWrappers" : "stackWrappers"} >
                        <div className="otherPlayersStack">
                            {this.renderOtherPlayersStack()}
                        </div>
                        {this.renderMiddle()}
                        {this.renderCurrPlayerStack()}
                    </div>
                    <ChangeColor visible={this.isColorChoiseVisible()} onColorChoiceClickFunc={this.onColorChoiceClick.bind(this)}/>
                    <Warning isMsgVisible={this.isMsgVisible()} msg={this.getWarningMsg()}/>
                    {currGame.gameLogic.isEndGameScreenActive && <EndGame winner={currGame.gameLogic.usersNamesArr[currGame.gameLogic.usersDoneNumberArr[0]]} loser={currGame.gameLogic.usersNamesArr[currGame.gameLogic.usersDoneNumberArr[currGame.gameLogic.numberOfPlayers-1]]} statistics={currGame.gameLogic.usersStatistics} stopFetchCurrGame={this.stopFetchCurrGame} backToLobby = {this.props.backToLobby}/>}
                </div>  

            );
        }
        else{return(<div></div>)};
    }

    isMsgVisible(){
        const {currGame} = this.state;
        if(currGame.gameLogic.warningMsg === "won" || currGame.gameLogic.warningMsg === "lose"){
            return currGame.gameLogic.isShowWarning
        }
        return currGame.gameLogic.isShowWarning && this.props.getCurrentUserTurnNumber() ===  currGame.gameLogic.userTurnNumber;
    }

    getWarningMsg(){

        const {currGame} = this.state;
        let warningMsg = currGame.gameLogic.warningMsg
        if(warningMsg === "won")
            warningMsg = currGame.gameLogic.usersNamesArr[currGame.gameLogic.usersDoneNumberArr[0]] + " won!";
        if(warningMsg === "lose")
            warningMsg = currGame.gameLogic.usersNamesArr[currGame.gameLogic.usersDoneNumberArr[currGame.gameLogic.numberOfPlayers-1]] + " lose!";
        return warningMsg;
    }

    isColorChoiseVisible(){
        const {currGame} = this.state;
        return (currGame.gameLogic.activeChangeColorfulFlag && this.props.getCurrentUserTurnNumber() ===  currGame.gameLogic.userTurnNumber) 
    }

    renderMiddle(){
        const gameLogic = this.state.currGame.gameLogic;
        return(
            <Middle 
                openCard={gameLogic.openCards.cardsArr[gameLogic.openCards.cardsArr.length-1]} //get the first card in openCards array
                onDeckClickFunc={this.onDeckClickFunc} 
                deckCardsCount={gameLogic.deck.cardsArr.length} 
                statistics={gameLogic.usersStatistics[this.props.getCurrentUserTurnNumber()]}
                openChat={this.openChat}
            />
        );
    }

    renderOtherPlayersStack(){
        const gameLogic = this.state.currGame.gameLogic;
        const numberOfPlayers = gameLogic.numberOfPlayers;
        let userNum;
        let res = [];

        for(userNum=0 ;userNum<numberOfPlayers ;userNum++){
            if(gameLogic.usersCards[userNum].cardsArr.length > 0){                
                if (userNum !== this.props.getCurrentUserTurnNumber())
                    res[userNum] = <div key = {userNum}> <PlayerStack nameOfClass="" numOfPlayers={numberOfPlayers} name={gameLogic.usersNamesArr[userNum]} showArrow={this.checkIsEnable(userNum)} id={userNum} cards={gameLogic.usersCards[userNum].cardsArr} onCardClickFunc={()=>{}} isEnable={true} getCurrUserId = {this.props.getCurrentUserTurnNumber} /> </div>
            }
        }
        return res;

    }

    renderCurrPlayerStack(){
        const gameLogic = this.state.currGame.gameLogic;
        const numberOfPlayers = gameLogic.numberOfPlayers;
        let userNum;
        let res = [];

        for(userNum=0 ;userNum<numberOfPlayers ;userNum++){
            if (userNum === this.props.getCurrentUserTurnNumber())
                res[userNum] = <div key = {userNum}> <PlayerStack nameOfClass="currPlayer" name={gameLogic.usersNamesArr[userNum]} showArrow={false} id={userNum} cards={gameLogic.usersCards[userNum].cardsArr} onCardClickFunc={this.onCardClickFunc} isEnable={this.checkIsEnable(userNum)} getCurrUserId = {this.props.getCurrentUserTurnNumber} backToLobby = {this.props.backToLobby} userTurnNumber = {this.state.currGame.gameLogic.userTurnNumber}/> </div>
        }
        return res;

    }

    checkIsEnable(userNum){
        return (this.state.currGame.gameLogic.userTurnNumber === userNum);
    }

    onCardClickFunc(eventSrc){    
        let src = this.shortcutSrc(eventSrc);
        let obj = {
            currGame: this.state.currGame,
            cardSrc: src,
            userNum: this.props.getCurrentUserTurnNumber()
        }
        fetch('/rooms/onCardClick', { method: 'POST', body: JSON.stringify(obj), credentials: 'include' });
    }
    
    shortcutSrc(src){
        let i, res;
        i = src.indexOf("cards");
        res = src.substring(i, src.length);
        return res;
    }

    onDeckClickFunc(){
        let obj = {
            currGame: this.state.currGame
        }
        if(this.props.getCurrentUserTurnNumber() ===  this.state.currGame.gameLogic.userTurnNumber){
            fetch('/rooms/onDeckClick', { method: 'POST', body: JSON.stringify(obj), credentials: 'include' });
        }      
    }

    onColorChoiceClick(color){
        let obj = {
            currGame: this.state.currGame,
            color: color,
        }
        fetch('/rooms/onColorChoiceClick', { method: 'POST', body: JSON.stringify(obj), credentials: 'include' });
        
    }

    openChat(){
        this.state.isShowChat = true;
    }

    backToGame(){
        this.state.isShowChat = false;
    }
}