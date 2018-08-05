const express = require('express');
const router = express.Router();
const auth = require('./auth');
const roomsManagement = express.Router();
const logic = require('./GameLogic.js');

const roomsList = [];
let roomId = 0;

roomsManagement.get('/allRooms', auth.userAuthentication, (req, res) => {
    res.json(roomsList);
});

roomsManagement.get('/roomById', auth.userAuthentication, (req, res) => {
    const id = req.query.id;
    const room = roomsList.find(room => room.id === Number(id));
    res.json(room);
});

roomsManagement.post('/addRoom', auth.userAuthentication, (req, res) => {
    const roomToAdd = JSON.parse(req.body);
    const currRoom = roomsList.find(room => room.name === roomToAdd.name);

    if (roomToAdd.name === ''){
        res.status(400).send("Room name can't be empty");
        return;
    }
    if (currRoom) {
        res.status(403).send(`Room name "${roomToAdd.name}" is already exists`);
        return;
    }

    roomToAdd.id = roomId;
    roomId++;
    roomsList.push(roomToAdd);
    res.sendStatus(201); //Created
});

roomsManagement.post('/updateRoom', (req, res) => {
    const updatedRoom = JSON.parse(req.body);
    const roomIndex = roomsList.findIndex(room => room.name === updatedRoom.name);
    
    roomsList[roomIndex] = updatedRoom;
    res.sendStatus(201);
});

roomsManagement.post('/removeRoom', (req, res) => {
    const roomToDelete = JSON.parse(req.body);
    const roomIndex = roomsList.findIndex(room => room.name === roomToDelete.name);
    roomsList.splice(roomIndex, 1); //At position 'roomIndex', remove 1 item
    res.sendStatus(201);
});

function createGame(currentGame) {
    currentGame.gameLogic = logic.createNewGameLogic(currentGame.numOfRegisterd, currentGame.usersNamesArr);
    currentGame.gameLogic.initializeBoard();
}

roomsManagement.get('/gameById', auth.userAuthentication, (req, res) => {
    const id = req.query.id;
    const currentGame = roomsList.find(game => game.id === Number(id));
    if(currentGame.gameLogic == undefined){
        createGame(currentGame);
    }
    res.json(currentGame);
});

roomsManagement.post('/onCardClick', (req, res) => {
    const bodyObj = JSON.parse(req.body);
    const currGame = roomsList.find(game => game.name === bodyObj.currGame.name);
    const cardSrc = bodyObj.cardSrc;   
    const userNum = bodyObj.userNum;   
    currGame.gameLogic.onUserCardClick(cardSrc, userNum);
    
    res.sendStatus(200);

});

roomsManagement.post('/onDeckClick', (req, res) => {
    const bodyObj = JSON.parse(req.body);
    const currGame = roomsList.find(game => game.name === bodyObj.currGame.name);
    if (currGame){
        currGame.gameLogic.onUserDeckClick();
    }
    res.sendStatus(200);
});

roomsManagement.post('/onColorChoiceClick', (req, res) => {
    const bodyObj = JSON.parse(req.body);
    const currGame = roomsList.find(game => game.name === bodyObj.currGame.name);
    const color = bodyObj.color;   
    currGame.gameLogic.chooseColor(color);
    
    res.sendStatus(200);

});

roomsManagement.post('/removeUserFromRoom', (req, res) => {
    const bodyObj = JSON.parse(req.body);
    const roomName = bodyObj.roomName;
    const userName = bodyObj.userName;
    const currRoom = roomsList.find(room => room.name === roomName);
    
    const userNameIndex = currRoom.usersNamesArr.findIndex(name => name === userName);
    currRoom.usersNamesArr.splice(userNameIndex, 1); //At position 'roomIndex', remove 1 item
    if(currRoom.usersNamesArr.length === 0){
        currRoom.gameLogic = undefined;
        currRoom.numOfRegisterd = 0;
        currRoom.isActive = false;
    }
    
    res.sendStatus(200);
});

module.exports = roomsManagement;