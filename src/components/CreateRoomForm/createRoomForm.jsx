import React from 'react';
import ReactDOM from 'react-dom';
import { userList } from '../../server/auth.js'
import "./createRoomForm.css"

export default class CreateRoomForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currRoom: {
                name: "",
                id:0,
                username: "",
                numOfPlayers: 0,
                numOfRegisterd: 0,
                isActive: false,
                usersNamesArr: []
            },

            errorMessage: ""

        }
        this.handleSubmitBtn = this.handleSubmitBtn.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePlayersNumChange = this.handlePlayersNumChange.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);

    }

    handleNameChange(event) {
        const room = this.state.currRoom;
        room.name = event.target.value;
        this.setState({ currRoom: room });
    }

    handlePlayersNumChange(event) {
        const room = this.state.currRoom;
        const value = Number(event.target.value);
        if(Number.isInteger(value) && value >= 2 && value <= 4){
            room.numOfPlayers = value;            
            this.setState({ 
                currRoom: room ,
                errorMessage: "" 
            });
        }
        else{
            room.numOfPlayers = 0;
            this.setState(() => ({ 
                currRoom: room ,
                errorMessage: "Number of players input must be integer number between 2 - 4" 
            }));
        }
    }

    fetchUserInfo() {
        return fetch('/users', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            });
    }

    handleSubmitBtn(event) {
        event.preventDefault();
        this.fetchUserInfo()
        .then(userInfo => {
            this.state.currRoom.username = (userInfo && userInfo.name) ? userInfo.name : '';
            fetch('/rooms/addRoom', { method: 'POST', body: JSON.stringify(this.state.currRoom), credentials: 'include' })
                .then(response => {
                    if (response.ok) {
                        this.setState(() => ({ errorMessage: "" }));
                        this.props.changeHiddenProperty();
                    } 
                    else {
                        if (response.status === 400) {
                            this.setState(() => ({ errorMessage: "Room name can't be empty" }));
                        }
                        if (response.status === 403) {
                            this.setState(() => ({ errorMessage: "Room name already exists, please try another one" }));
                        }
                    }
                });
        });

        return false;

    }

    render(){
        return(
            <div className = "">
                <div className="createNewRoomWrapper" >
                    <label className="roomNameLabel" htmlFor="roomsName"> Room's name: </label>
                    <input className="roomNameInput" name="roomsName" onChange={this.handleNameChange} /> 
                    <label className="playersNumLabel" htmlFor="playersNum"> Number of players: </label>
                    <input className="playersNumInput" name="playersNum" onChange={this.handlePlayersNumChange} />
                    <input onClick={this.handleSubmitBtn} className="submitBtn" type="submit" value="Submit" disabled={this.isSubmitBtnEnable()}/>
                    {this.renderErrorMessage()}
                </div>
            </div>
        )
    }

    isSubmitBtnEnable(){
        return (this.state.currRoom.numOfPlayers<2 || this.state.currRoom.numOfPlayers>4);
    }

    renderErrorMessage() {
        if (this.state.errorMessage) {
            return (
                <div className="errorMessage">
                    {this.state.errorMessage}
                </div>
            );
        }
        return null;
    }
}