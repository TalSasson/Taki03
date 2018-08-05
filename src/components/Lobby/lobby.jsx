import React from 'react';
import ReactDOM from 'react-dom';
import UsersContainer from '../UsersContainer/usersContainer.jsx';
import CreateRoomBtn from '../CreateRoomBtn/createRoomBtn.jsx';
import CreateRoomForm from '../CreateRoomForm/createRoomForm.jsx';
import RoomsContainer from '../RoomsContainer/roomsContainer.jsx';
import "./lobby.css"

export default class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCreateRoomFormVisible : true
        }
    }

    render(){        
        return(
            <div className="lobbyRoomContainer">
                {this.state.isCreateRoomFormVisible && <div className = "contentLobbyWrapper" >
                    <div className="userInfoArea">
                        Hello {this.props.username}
                        <button className="logoutBtn" onClick={this.props.logoutHandler}>Logout</button>
                    </div>
                    <UsersContainer />
                    <RoomsContainer username = {this.props.username} updateUserInRoom = {this.props.updateUserInRoom}/>
                    <CreateRoomBtn func={this.changeCreateRoomFormVisible.bind(this)}/>
                </div>}
                {!this.state.isCreateRoomFormVisible && <div className = "createRoomForm">
                    <CreateRoomForm changeHiddenProperty={this.changeCreateRoomFormVisible.bind(this)}/>
                </div>}
            </div>
        )
    }

    
    changeCreateRoomFormVisible(){
        this.setState({isCreateRoomFormVisible: !this.state.isCreateRoomFormVisible});
    }
}
