const Room = require('../models/room');

let service = {};

service.findRoom = findRoom;
service.createRoom = createRoom;
service.joinRoom = joinRoom;

module.exports = service;

function findRoom(joinCode) {
    return new Promise((resolve, reject) => {
        // use mongoose to find the room
        Room.find({joinCode: joinCode}, (err, rooms) => {
            if (err) reject(err);
            
            // check if any room results were found
            if (rooms.length < 1) resolve(null);   

            // return the room
            resolve(rooms[0]);
        });
    });
}

function createRoom(joinCode) {
    return new Promise((resolve, reject) => {
        // use mongoose to create the room
        Room.create({joinCode: joinCode}, (err, room) => {
            if (err) reject(err);
            
            // return the room
            resolve(room);
        });
    });
}

function joinRoom(joinCode, socket) {
    return new Promise((resolve, reject) => {
        // find the room using service function
        findRoom(joinCode).then((room) => {
            // add the user to the room
            Room.updateOne(
                { _id: room._id },
                { $push: { participants: socket.id }},
                function (err, doc) {
                    if (err) reject(err);

                    // set the socket's room
                    socket.room = room.joinCode;

                    // join the appropriate socket
                    socket.join(room.joinCode);

                    // emit welcome messages
                    socket.volatile.emit('message', 'SERVER', `Welcome to room "${room.joinCode}"!`);
                    socket.volatile.in(room.joinCode).emit('message', 'SERVER', `User ${socket.id} has joined the room`);

                    resolve(true);
                }
            );
        }, (err) => {
            reject(err);
        })
    });
}