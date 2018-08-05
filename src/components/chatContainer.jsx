import React from 'react';
import ReactDOM from 'react-dom';
import ConverssionArea from './converssionArea.jsx';
import ChatInput from './chatInput.jsx';

export default class ChatContainer extends React.Component {
   
    constructor(props) {
        super(props);

    }

    render(){
        return(
            <div className="chatContaier">
                <div className="backToGameBtn" onClick={this.props.backToGame}>
                    <span>Back To Game</span>
                </div>
                <ChatInput />
                <ConverssionArea />

            </div>
        );
    }

    
}