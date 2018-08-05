import React from 'react';
import ReactDOM from 'react-dom';
import "./warning.css";


export default class Warning extends React.Component {

    render(){        
        return(
            <div className={this.props.isMsgVisible ? "warning visibleWarning" : "warning"}>
                {this.props.msg}
            </div>
        );
    }
}