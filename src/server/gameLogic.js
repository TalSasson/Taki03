class LogicStatistics{

    constructor(){
        this.turnCount=0;        
        this.lastCardCount=0;
        this.timeElapsedInSec = Math.round((new Date()).getTime() / 1000); //time in seconds from 1/1/1970
        this.oneTurnTime = 0; //the time of one turn for each user
        this.totalTurnsTime = 0;
    }

    increaceTurnCount(){
        this.turnCount++;
    }
    increaceLastCardCount(num){
        this.lastCardCount++;
    }
    getLastCardCount(){
        return this.lastCardCount;
    }
    getTotalMoves(){
        return this.turnCount;
    }
    increaseTimeElapsedInSec(){
        this.timeElapsedInSec++;
    }
    getTimeElapsedInSec(){
        return this.timeElapsedInSec;
    }
    getAvg(){
        if (this.turnCount === 0) return 0;
            return this.timeElapsedInSec/this.turnCount;
    }
    startTurnTimeCount(){
        this.oneTurnTime = (new Date()).getTime() / 1000; ////time in sec from 1/1/1970
    }
    endTurnTimeCount(){
        this.totalTurnsTime += ((new Date()).getTime() / 1000) - this.oneTurnTime;
        this.oneTurnTime = 0;
    }
}

class LogicCard{

    constructor(i_name, i_color, i_type){
        this.name= i_name;
        this.color= i_color;
        this.type= i_type;
    }


    getType() { return this.type;}
    getName() { return this.name;}
    getColor() { return this.color;}
    setColor(newColor) {
        this.color = newColor;
    }

    getSrc(){

        let res;

        if(this.name === "taki_colorful" && this.color)
            res = "./cards/taki";
        else
            res = "./cards/" + this.name;

        if(this.color)
            res += "_" + this.color;
        res += ".png";
        
        return res;
    }
    
    isPowerCard(){
        return (this.name === "change_colorful" || this.name === "taki_colorful");
    }
}

class LogicDeck{

    constructor(){
        this.cardsArr = [];
    }

    getLength(){return this.cardsArr.length;}

    initializeDeck(){
        let i, j, k;
        const colorsArr = ["blue", "green", "yellow", "red"];
        const namesArr = ["1","3","4","5","6","7","8","9","2plus","plus","stop","taki","change_colorful"];
        
        for(i = 0; i < 4; i++)
        {
            for(j = 0; j < namesArr.length; j++)
            {        
                for(k = 0; k < (j <= 11 ? 2 : 1 ); k++)//change color - only 4 cards, 1 each iteration.
                {
                    this.cardsArr.push(new LogicCard(
                        /*name=*/ namesArr[j],
                        /*color=*/ j <= 11 ? colorsArr[i] : 0 ,
                        /*type=*/ j <= 7 ? "number" : "action"
                    ));
                }
            }
        }

        // add two taki_colorful cards:
        for(i = 0; i < 2; i++)
        {
            this.cardsArr.push(new LogicCard(
                /*name=*/ "taki_colorful",
                /*color=*/ 0 ,
                /*type=*/ "action"
            ));
        }

    }

    removeRandomCard(){
        let randNum, tempCard, res;

        if (this.cardsArr.length === 0){
            return null;
        }

        randNum = getRandomNum(0, this.cardsArr.length);
        tempCard = this.cardsArr[randNum];
        this.cardsArr[randNum] = this.cardsArr[this.cardsArr.length-1];
        this.cardsArr[this.cardsArr.length-1] = tempCard;
        res = tempCard;
        this.cardsArr.pop();
        return res;
    }

    addCard(card){            
        this.cardsArr.push(card);            
    }

}

class LogicStack{
    
    constructor(i_name){
        this.cardsArr = [];
        this.name = i_name;
    }

    getName(){
        return this.name;
    }
    setName(name){
        this.name = name;
    }

    getCardsArr(){
        return this.cardsArr;
    }

    getLength(){return this.cardsArr.length;}

    addCard(card){
        this.cardsArr.push(card);            
    }

    removeCard(card){
        let tempCard, i, res;
        if(!card){ // if we don't send a argument, we will remove the first card.
            res = this.cardsArr.shift();               
        }
        else{ // else, we will find the card and remove it.
            for(i=0;i<this.cardsArr.length;i++){
                if (card === this.cardsArr[i])
                    break;
            }
            tempCard = this.cardsArr[i];
            this.cardsArr[i] = this.cardsArr[this.cardsArr.length-1];
            this.cardsArr[this.cardsArr.length-1] = tempCard;
            res = tempCard;
            this.cardsArr.pop();                
        }

        return res;
    }

    getCardBySrc(src){
        let i;
        src= "./" + src;
        for(i=0;i<this.cardsArr.length;i++){            
            if (src === this.cardsArr[i].getSrc())
                return this.cardsArr[i];
        }
        return null;
    }

    getLastCard(){
        return this.cardsArr[this.cardsArr.length-1];
    }

    getPrevLastCard(){
        if(this.cardsArr.length >= 2)
            return this.cardsArr[this.cardsArr.length-2];
        else
            this.getLastCard(); 
    }

    isExist(name, color){
        let i;
        for(i=0;i<this.cardsArr.length;i++){
            if ((name === "" && this.cardsArr[i].getColor() === color)                         ||
                (name === this.cardsArr[i].getName() && color === "")                          ||
                (this.cardsArr[i].getName() === name && this.cardsArr[i].getColor() === color) ||
                (name === this.cardsArr[i].getName().substring(0,4) && color === "")){
                    return this.cardsArr[i];
                }                    
        }
        return null;
    }

    countCardsInColor(color){
        let i, count = 0;
        for(i=0;i<this.cardsArr.length;i++){            
            if (this.cardsArr[i].getColor() === color)
                count++;
        }
        return count;        
    }

    isPossibleMove(openCard){
        let returnCard;

        if ((returnCard = this.isExist("2plus", openCard.getColor()))||
            (returnCard = this.isExist("change_colorful", 0))        ||
            (returnCard = this.isExist("stop", openCard.getColor())) ||
            (returnCard = this.isExist("plus", openCard.getColor())) ||
            (returnCard = this.isExist("taki_colorful", 0))          ||
            (returnCard = this.isExist("taki", openCard.getColor())) ||               
            (returnCard = this.isExist("", openCard.getColor()))     ||           
            (returnCard = this.isExist(openCard.getName(), ""))      ||
            (returnCard = this.isExist(openCard.getName().substring(0,4), "")))            
            {
                return returnCard;
            }
        return null;
    }
}

class LogicBoard{

    constructor(i_numberOfPlayers, i_usersNamesArr){
        this.deck;
        this.numberOfPlayers = i_numberOfPlayers;
        this.usersCards = [];
        this.usersNamesArr = i_usersNamesArr.slice(0);
        this.openCards;
        this.usersStatistics = [];        
        this.takiModeCounter;
        this.plus2ModeCounter;
        this.timerInterval;
        this.userTurnNumber;
        this.usersDoneNumberArr;
        this.warningMsg;
        this.isShowWarning;
        this.isEndGameScreenActive;
    }

    initializeBoard (){
        let i, userNum;

        this.deck = new LogicDeck();
        for(userNum=0; userNum < this.numberOfPlayers; userNum++){
            this.usersCards[userNum] = new LogicStack(this.usersNamesArr[userNum]);
            this.usersStatistics[userNum] = new LogicStatistics(); 
        }            
        this.openCards = new LogicStack("openCards");
       
        this.takiModeCounter = 0;
        this.plus2ModeCounter = 0;        
        this.timerInterval = null;
        this.activeStopFlag = 0;
        this.active2PlusFlag = 0;
        this.userTurnNumber = 0;
        this.activeChangeColorfulFlag = false;
        this.usersDoneNumberArr = [];
        this.warningMsg = "";
        this.isShowWarning = false;
        this.isEndGameScreenActive = false;
        this.usersStatistics[this.userTurnNumber].startTurnTimeCount();

        this.deck.initializeDeck();
        for(i=0;i<8;i++){
            for(userNum=0; userNum < this.numberOfPlayers; userNum++){
                this.cardFromDeckToUser(userNum);
            }
        }
        this.cardFromDeckToOpenCards();
    }

    getNumberOfPlayers(){
        return this.numberOfPlayers;
    }

    getUserCards(userNum){
            return this.usersCards[userNum].getCardsArr();
    }

    getStatistics(userNum){
        return this.usersStatistics[userNum];
    }
    getDeckLength(){
            return this.deck.getLength();
    }    
    getOpenCard(){
            return this.openCards.getLastCard();
    }
    getTakiModeCounter(){
        return this.takiModeCounter;
    }
    getPlus2ModeCounter(){
        return this.plus2ModeCounter;
    }
    increasePlus2ModeCounter(){
        this.plus2ModeCounter++;
    }
    initializePlus2Counter(){
        this.plus2ModeCounter=0;
        this.active2PlusFlag = 0;
    }
    increaseTimeElapsedInSec(){
        this.statistics.increaseTimeElapsedInSec();
    }
    getTimeElapsedInSec(){
        return this.statistics.getTimeElapsedInSec();
    }
    getAvg(){
        return this.statistics.getAvg();
    }
    increaceLastCardCount(){
        this.statistics.increaceLastCardCount();
    }
    getLastCardCount(){
        return this.statistics.getLastCardCount();
    }
    getStackLength(userNum){
        return this.usersCards[userNum].getLength();
    }
    turnDone(userNum){
        let isFinishNow = false;
        this.usersStatistics[userNum].increaceTurnCount();
        this.reachedLastCard(userNum);
        this.usersStatistics[userNum].endTurnTimeCount();

        if(this.getStackLength(userNum) === 0){ //the user is finish to play
            isFinishNow = true;
            if(this.usersDoneNumberArr.length === 0){
                this.userWonWarning();
            }
            this.usersDoneNumberArr.push(userNum);            
            if(this.numberOfPlayers - this.usersDoneNumberArr.length === 1){ //the players that stay in the game
                //push the last user
                let i;
                for(i=0;i<this.numberOfPlayers ;i++){
                    if(this.usersCards[i].getLength() > 0){
                        this.usersDoneNumberArr.push(i);
                        break;
                    }
                }
                this.userLoseWarning();
                this.endGame();
                return;
            }
        }

        this.increaseUserTurnNumber(isFinishNow);
        this.usersStatistics[this.userTurnNumber].startTurnTimeCount();
    }

    endGame(){
        setTimeout(()=>{
            this.isEndGameScreenActive = true;
        },2000);
    }

    getUserTurnNumber(){
        return this.userTurnNumber;
    }
    increaseUserTurnNumber(isFinishNow){
        if(this.activeStopFlag === 0)
            this.userTurnNumber = (this.userTurnNumber + 1) % this.numberOfPlayers;
        else{
            this.userTurnNumber = (this.userTurnNumber + 1) % this.numberOfPlayers;
            //check if the user that his number is this.userTurnNumber already finish
            while(this.usersDoneNumberArr.includes(this.userTurnNumber)){
                this.userTurnNumber = (this.userTurnNumber + 1) % this.numberOfPlayers;
            }
            this.userTurnNumber = (this.userTurnNumber + 1) % this.numberOfPlayers;
        }

        //check if the user that his number is this.userTurnNumber already finish
        while(this.usersDoneNumberArr.includes(this.userTurnNumber)){
            this.userTurnNumber = (this.userTurnNumber + 1) % this.numberOfPlayers;
        }
    }
    getTotalMoves(){
        return this.statistics.getTotalMoves();
    }
    cardFromDeckToUser(userNum){
        let card = this.deck.removeRandomCard();            
        this.usersCards[userNum].addCard(card);
        if (this.deck.getLength() === 0) 
            this.moveAllOpenCardsToDeck();        
        return card;
    }
  
    reachedLastCard(userNum){
        if(this.usersCards[userNum].getLength() === 1)
            this.usersStatistics[userNum].increaceLastCardCount();     
    }
    cardFromDeckToOpenCards(){
        let card;
        let found = false;
        while (!found){
            card = this.deck.removeRandomCard();
            if (card.getType() === "number"){
                found = true;
                this.openCards.addCard(card);
            }
            else{
                this.deck.addCard(card);
            }
        }
        return card;
    }
    cardFromUserToOpenCards(userNum, userCard){
        let card = this.usersCards[userNum].removeCard(userCard);
        this.openCards.addCard(card);
    }
    cardFromOpenCardsToDeck(){
        let card = this.openCards.removeCard();
        if(card.getName() === "change_colorful" || card.getName() === "taki_colorful")
            card.setColor(0);
        this.deck.addCard(card);
    }
    moveAllOpenCardsToDeck(){
        while(this.openCards.getLength() > 1){
            this.cardFromOpenCardsToDeck();
        }
    }
    getLastCard(){
        return this.openCards.getLastCard();
    }   

    onUserCardClick(src, userNum){ //checks if the card is suitable to the open card.
        let userCard, openCard, activeTakiFlag, card, activePlusFlag, color, activeColofulFlag;

        userCard = this.usersCards[this.userTurnNumber].getCardBySrc(src);
        if (userCard == null) return;
        openCard = this.openCards.getLastCard();

        if(this.getTakiModeCounter() > 0){
            card = this.stayInTakiMode(src, userCard, openCard);
        }
        else if (this.getPlus2ModeCounter() > 0){
            card = this.onUserCardClickPlus2Mode(this.userTurnNumber, src);
        }
        else{
            activeTakiFlag = 0;
            activePlusFlag = 0;
            this.activeStopFlag = 0;
            activeColofulFlag = 0;
            this.active2PlusFlag = 0;
            if( userCard.getName() === openCard.getName()   ||
                userCard.getColor() === openCard.getColor() || 
                userCard.isPowerCard()                      || 
                userCard.getName().substring(0,4) === openCard.getName().substring(0,4) )
                {
                    if(userCard.getName().substring(0, 4) === "taki"){ 
                        color = userCard.getColor();
                        if(userCard.getName() === "taki_colorful"){
                            activeColofulFlag = 1;
                            color = this.setTakiColorfulColor(openCard);
                        }
            
                        //change user click to taki mode
                        this.setTakiModeCounter(this.userTurnNumber, color); // count how many cards in the stack have the same color like the taki
                        if (activeColofulFlag !== 1) {
                            this.takiModeCounter--
                        }                            
                        if(this.getTakiModeCounter() > 0){
                            activeTakiFlag = 1;
                        }                  
                    }

                    if(userCard.getName() === "2plus"){
                        this.increasePlus2ModeCounter(); //increase the plus2ModeCounter from 0 to 1.
                        this.active2PlusFlag = 1;
                    }
        
                    if(userCard.getName() === "stop"){
                        this.activeStopFlag = 1;
                    }
                    if(userCard.getName() === "plus"){
                        activePlusFlag = 1;
                    }
                    if(userCard.getName() === "change_colorful"){
                        if (this.getStackLength(this.userTurnNumber) > 0 || this.numberOfPlayers > 2){
                            this.activeChangeColorfulFlag = true;
                            this.cardFromUserToOpenCards(this.userTurnNumber, userCard);
                            return userCard;
                        }
                    }
                    this.cardFromUserToOpenCards(this.userTurnNumber, userCard);
                    if(activeColofulFlag === 1) this.openCards.getLastCard().setColor(color);
                    if(activeTakiFlag !== 1 && activePlusFlag !== 1) this.turnDone(this.userTurnNumber);
                    return userCard;
                }
                else{ //The user clicked on wrong card
                    this.wrongCardClickWarning();
                }
            }
        return card;                        
    }

    stayInTakiMode(src, userCard, openCard){
        let card = this.onUserCardClickTakiMode(src, userCard, openCard);

        if(this.getTakiModeCounter() === 0){
            if(userCard.getName() === "stop"){
                this.activeStopFlag = 1;
            }
            else{
                this.activeStopFlag = 0;
            }

            if(userCard.getName() === "2plus"){
                this.increasePlus2ModeCounter(); //increase the plus2ModeCounter from 0 to 1.
                this.active2PlusFlag = 1;
            }

            if(userCard.getName() !== "plus"){
                this.turnDone(this.userTurnNumber);
            }
        }
    }

    onUserCardClickTakiMode(src, userCard, openCard){    
        if(userCard.getColor() === openCard.getColor())
        {
            this.cardFromUserToOpenCards(this.userTurnNumber, userCard);
            this.takiModeCounter--;               
            return userCard;                   
        }
        else{
            this.wrongCardClickWarning();
        }
        return null;                        
    }

    onUserCardClickPlus2Mode(userNum, src){
        let userCard, openCard;
        userCard = this.usersCards[userNum].getCardBySrc(src);
        openCard = this.openCards.getLastCard();

        if(userCard.getName() === openCard.getName()) // === "2plus"
        {
            this.cardFromUserToOpenCards(this.userTurnNumber, userCard);
            this.increasePlus2ModeCounter();
            this.turnDone(this.userTurnNumber);        
            return userCard;                   
        }
        else{
            this.wrongCardClickWarning();
        }
        return null;  
    }

    setTakiModeCounter(userNum, color){
        this.takiModeCounter = this.usersCards[userNum].countCardsInColor(color);
    }

    onUserDeckClick(){
        this.activeStopFlag = 0;
        let possibleCard, returnCard, openCard;

        if(this.active2PlusFlag === 1){
            this.onUserDeckClickPlus2Mode(this.userTurnNumber);
        }else{
            openCard = this.openCards.getLastCard();
            possibleCard = this.usersCards[this.userTurnNumber].isPossibleMove(openCard);
            if(possibleCard){
                this.wrongDeckClickWarning();
                returnCard =  null;
            }
            else{ //possibleCard === null
                returnCard = this.cardFromDeckToUser(this.userTurnNumber);
                this.turnDone(this.userTurnNumber); 
            }
        }
        return returnCard;
    }

    onUserDeckClickPlus2Mode(userNum){
        let possibleCard, returnCard, openCard, i, counter;
        openCard = this.openCards.getLastCard();
        possibleCard = this.usersCards[userNum].isExist("2plus", "");
        if(possibleCard){
            this.wrongDeckClickWarning();
            returnCard =  null;
        }
        else{ //possibleCard === null
            counter = this.getPlus2ModeCounter() * 2;
            for (i=0;i<counter;i++)
                returnCard = this.cardFromDeckToUser(userNum);
            this.initializePlus2Counter();
            this.turnDone(this.userTurnNumber);
        }
        return returnCard;
    }

    chooseColor(color){
        let card;

        card = this.openCards.getLastCard();
        card.setColor(color);
        this.activeChangeColorfulFlag = false;

        this.turnDone(this.userTurnNumber);
        return card.getSrc();            
    }

    setTakiColorfulColor(openCard){
        let color, card;

        color = this.openCards.getLastCard().getColor();
        return color; 
    }

    checkEndGame(){
        let userNum;
        for(userNum=0; userNum < this.numberOfPlayers; userNum++){
            if(this.usersCards[userNum].getLength() === 0){ 
                return userNum;
            }
        }
        return null;
    }

    timer(){
        this.timerInterval = setInterval(()=>{
            this.statistics.increaseTimeElapsedInSec();           
        }, 1000);
    }

    clearTimerInterval(){
        clearInterval(this.timerInterval);
    }

    wrongCardClickWarning(){
        this.warningMsg = "Illegal card";
        this.isShowWarning = true;
        setTimeout(()=>{
            this.isShowWarning = false;
        },1000);
    }

    wrongDeckClickWarning(){
        this.warningMsg = "You have a suitable card";
        this.isShowWarning = true;
        setTimeout(()=>{
            this.isShowWarning = false;
        },1000);
    }

    userWonWarning(){
        this.warningMsg = "won";
        this.isShowWarning = true;
        setTimeout(()=>{
            this.isShowWarning = false;
        },2000);
    }

    userLoseWarning(){
        this.warningMsg = "lose";
        this.isShowWarning = true;
        setTimeout(()=>{
            this.isShowWarning = false;
        },1500);
    }
}

function getRandomNum(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function createNewGameLogic(numberOfPlayers, usersNamesArr){
    return(new LogicBoard(numberOfPlayers, usersNamesArr));
}
module.exports = {createNewGameLogic}