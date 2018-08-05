import React from 'react';
import ReactDOM from 'react-dom';
import "./createRoomBtn.css";

export default class CreateRoomBtn extends React.Component {
    render(){
        return(
            <div className="btnContainer" onClick = {this.props.func}>
                Create room
            </div>
        );
    };
}