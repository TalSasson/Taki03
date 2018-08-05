import React from 'react';
import ReactDOM from 'react-dom';
import Room from '../Room/room.jsx';
import "./roomsContainer.css"


export default class RoomsContainer extends React.Component {
    constructor(props) {
        super(props);        
        this.state = {
            rooms: []
        }

        this.getRoomsListContent = this.getRoomsListContent.bind(this);
    }

    componentDidMount() {
        this.getRoomsListContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    getRoomsListContent() {
        return fetch('/rooms/allRooms', { method: 'GET', credentials: 'include' })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getRoomsListContent, 1000);
                return response.json();
            })
            .then((rooms) => rooms && rooms.length >= 0 && this.setState({ rooms }))
            .catch(err => { throw err });
    }

    render() {        
        const {username, updateUserInRoom} = this.props;
        return (
            <div className="roomsList">
                {this.state.rooms.map(room => (
                    <Room key={room.id} roomDetails={room} username={username} updateUserInRoom = {updateUserInRoom}/>)
                )}
            </div>
        );
    }
}