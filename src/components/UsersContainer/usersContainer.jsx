import React from 'react';
import ReactDOM from 'react-dom';
import { userList } from '../../server/auth.js'
import './usersContainer.css'

export default class UsersContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {}
        }
    }

    componentDidMount() {
        this.getUserListContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    getUserListContent() {
        fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
        .then((response) => {
            if (!response.ok){
                throw response;
            }
            this.timeoutId = setTimeout(this.getUserListContent.bind(this), 1000);
            return response.json();
        })
        .then((users) => this.setState({users}))
        .catch(err => {throw err});
    }


    render(){
        return(
            <div className="userList"> 
                <div className="titleUserList">User's List:</div>               
                {
                    Object.values(this.state.users).map((username) =>
                        <div key={username}>{username}</div>
                    )                    
                }
            </div>
        );
    };

}