import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import Lobby from './Lobby/lobby.jsx';
import WaitingForGame from './WaitingForGame/waitingForGame.jsx';
import GameBoard from './GameBoard/gameBoard.jsx';




export default class BaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            showLogin: true,
            currentUser: {
                name: '',
                isInRoom: false,
                userInGameTurnNumber: -1 //example: if there is 3 players in the game, then one of them will be turnNumber 0, one will be 1, and one will be 2.       
            },
            currentRoom: {},
        };
        
        this.updateUserInRoom = this.updateUserInRoom.bind(this);
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.backToLobby = this.backToLobby.bind(this);
        this.logoutHandler= this.logoutHandler.bind(this);
        this.getCurrentUserTurnNumber = this.getCurrentUserTurnNumber.bind(this);

        this.getUsername();
    }
    
    render() {        
        if (this.state.showLogin) {
            return (<LoginModal loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError}/>)
        }
        return this.renderLobbyRoom();
    }


    handleSuccessedLogin() {
        this.setState(()=>({showLogin:false}), this.getUsername);        
    }

    handleLoginError() {
        this.setState(()=>({showLogin:true}));
    }

    renderLobbyRoom() {
        if(this.state.currentUser.isInRoom){
            return(<WaitingForGame user={this.state.currentUser} room={this.state.currentRoom} updateUserInRoom = {this.updateUserInRoom} getCurrentUserTurnNumber = {this.getCurrentUserTurnNumber} backToLobby = {this.backToLobby}/>)
        }
        return(
            <div>
                <Lobby username = {this.state.currentUser.name} updateUserInRoom={this.updateUserInRoom} logoutHandler = {this.logoutHandler} />
            </div>
        );
    }

    backToLobby(){
        const user = this.state.currentUser;
        const userName = user.name;
        const roomName = this.state.currentRoom.name;
        user.isInRoom = false;
        const obj = {
            userName : userName,
            roomName : roomName
        }

        this.setState({
            currentUser : user,
            currentRoom : null
        });

        fetch('/rooms/removeUserFromRoom', { method: 'POST', body: JSON.stringify(obj) , credentials: 'include' })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
    }

    updateUserInRoom(flag, room){
        const user = this.state.currentUser;
        user.isInRoom = flag;
        user.userInGameTurnNumber = room.numOfRegisterd-1;
        this.setState({
            currentUser : user,
            currentRoom : room
        });
    }


    getUsername() {
        this.fetchUserInfo()
        .then(userInfo => {
            this.setState(()=>({currentUser:userInfo, showLogin: false}));
        })
        .catch(err=>{            
            if (err.status === 401) { // incase we're getting 'unautorithed' as response
                this.setState(()=>({showLogin: true}));
            } else {
                throw err; // in case we're getting an error
            }
        });
    }

    fetchUserInfo() {        
        return fetch('/users',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }
            return response.json();
        });
    }

    logoutHandler() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`failed to logout user ${this.state.currentUser.name} `, response);                
            }
            this.setState(()=>({currentUser: {name:''}, showLogin: true}));
        })
    }

    getCurrentUserTurnNumber(){
        return this.state.currentUser.userInGameTurnNumber;
    }
}