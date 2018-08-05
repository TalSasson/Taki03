import React from 'react';
import ReactDOM from 'react-dom';
import GameBoard from '../GameBoard/gameBoard.jsx';
import './waitingForGame.css'


export default class WaitingForGameScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currRoom: {}
        }
        this.timeoutId;
        this.getCurrRoomData = this.getCurrRoomData.bind(this);
        this.updateUserExitGame = this.updateUserExitGame.bind(this);
    }
    

    componentDidMount() {
        this.getCurrRoomData();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    
    getCurrRoomData() {
        const { room } = this.props;

        return fetch(`/rooms/roomById/?id=${room.id}`, { method: 'GET', credentials: 'include' })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getCurrRoomData, 1000);
                return response.json();
            })
            .then((currRoom) => currRoom && this.setState({ currRoom }))
            .then((currRoom) => currRoom && (this.changeActivationIfNeeded(currRoom)) )
            .catch(err => { throw err });
    }
    
    changeActivationIfNeeded(currRoom){
        if(currRoom.isActive)
            this.props.changeActivation(true);
    }

    render() {
        const { user } = this.props;
        const { currRoom } = this.state;
        let isGameActive = currRoom.isActive;

        if (isGameActive && this.timeoutId){
            clearTimeout(this.timeoutId);
        }
        if (!isGameActive) {
            return (
                <div className="gameContainer">
                    <div className="waitingScreen" >
                        <div> There are {currRoom.numOfRegisterd} players in the game</div>
                        <div> waiting for {currRoom.numOfPlayers - currRoom.numOfRegisterd} players to join </div>
                        <button className="exitGameBtn" onClick={() => this.updateUserExitGame()}>
                            Exit Game
                        </button>
                    </div>
                </div>
            )
        }
        return (<GameBoard roomDetails = {currRoom} userDetails = {user} getCurrentUserTurnNumber = {this.props.getCurrentUserTurnNumber} backToLobby = {this.props.backToLobby}/>);
    }

    updateUserExitGame() {
        const { user } = this.props;
        const room = this.state.currRoom;
        const index = room.usersNamesArr.indexOf(user.name)
        room.numOfRegisterd--;
        room.usersNamesArr.splice(index, 1); // At position 'index', remove 1 item
        fetch('/rooms/updateRoom', { method: 'POST', body: JSON.stringify(room), credentials: 'include' });
        this.props.updateUserInRoom(false, {});
    }
}