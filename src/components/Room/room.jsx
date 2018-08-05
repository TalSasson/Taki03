import React from 'react';
import ReactDOM from 'react-dom';
import "./room.css"


export default class Room extends React.Component {
    constructor(props) {
        super(props);

        this.userJoinToRoom = this.userJoinToRoom.bind(this);
        this.removeRoom = this.removeRoom.bind(this);
    }

    userJoinToRoom() {
        const {roomDetails} = this.props;
        roomDetails.numOfRegisterd++;
        this.props.updateUserInRoom(true, roomDetails);
        roomDetails.usersNamesArr.push(this.props.username);
        if (roomDetails.numOfRegisterd === roomDetails.numOfPlayers) {
            roomDetails.isActive = true;
        }
        fetch('/rooms/updateRoom', { method: 'POST', body: JSON.stringify(roomDetails), credentials: 'include' });
    }

    removeRoom(room) {
        fetch('/rooms/removeRoom', { method: 'POST', body: JSON.stringify(room), credentials: 'include' });
    }

    render() {
        const { roomDetails, username, updateUserInRoom} = this.props;
        let borderStyle = roomDetails.isActive ? { border: '2px solid limegreen', padding: '17px' } : { border: '2px solid crimson' }
        let isUserCanRemoveTheRoom = roomDetails.username === username;
        let isNoOneRegisterd = roomDetails.numOfRegisterd === 0;

        return (
            <div className="roomInfo">
                <div className={"room_" + roomDetails.id} style={borderStyle}>
                    <div>
                        Room's Name: {roomDetails.name}
                    </div>
                    <div>
                        Created username: {roomDetails.username}
                    </div>
                    <div>
                        Number Of Players: {roomDetails.numOfPlayers}
                    </div>
                    <div>
                        Number Of Registerd: {roomDetails.numOfRegisterd}
                    </div>
                    <div>
                        Game's Status: {roomDetails.isActive ? "Game Started" : "Game didn't start"}
                    </div>
                    <button className="joinRoomBtn" hidden={roomDetails.isActive} onClick={() => this.userJoinToRoom()}>Join Game</button>
                    <button hidden={!(isUserCanRemoveTheRoom && isNoOneRegisterd)} className="RemoveGame" onClick={() => this.removeRoom(roomDetails)}> Remove Game </button>
                </div>
            </div>
        );
    }
}