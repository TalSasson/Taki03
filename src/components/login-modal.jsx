import React from 'react';
import ReactDOM from 'react-dom';
import takiImage from './resources/TAKI_logo.png';

export default class LoginModal extends React.Component {
    constructor(args) {
        super(...args);

        this.state ={
            errMessage: ""
        }

        this.handleLogin = this.handleLogin.bind(this);        
    }
    
    render() {
        return (
            <div className="login-page-wrapper">
                <img className="taki-logo" src={takiImage} />
                <div className="instruction">Welcome! Please login to start play</div>
                <form onSubmit={this.handleLogin} className="formWrapper">
                    <label className="username-label" htmlFor="username"> name: </label>
                    <input className="username-input" name="username"/>                        
                    <input className="submit-btn btn" type="submit" value="Login"/>
                </form>
                {this.renderErrorMessage()}
            </div>
        );
    }

    renderErrorMessage() {
        if (this.state.errMessage) {
            return (
                <div className="login-error-message">
                    {this.state.errMessage}
                </div>
            );
        }
        return null;
    }

    handleLogin(e) {
        e.preventDefault();
        const username = e.target.elements.username.value;
        fetch('/users/addUser', {method:'POST', body: username, credentials: 'include'})
        .then(response=> {            
            if (response.ok){
                this.setState(()=> ({errMessage: ""}));
                this.props.loginSuccessHandler();
            } else {
                if (response.status === 403) {
                    this.setState(()=> ({errMessage: "User name already exist, please try another one"}));
                }
                if (response.status === 400) {
                    this.setState(()=> ({errMessage: "User name can't be empty"}));
                }
                this.props.loginErrorHandler();
            }
        });
        return false;
    }    
}