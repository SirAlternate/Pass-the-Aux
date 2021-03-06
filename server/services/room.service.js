const Room = require('../models/room');

module.exports = {
  findRoom(joinCode) {
    return new Promise((resolve, reject) => {
      // use mongoose to find the room
      Room.findOne({ joinCode }, (err, room) => {
        if (err) reject(err);

        // check if any room results were found
        if (!room) resolve(null);

        // return the room
        resolve(room);
      });
    });
  },

  createRoom(socket, payload) {
    return new Promise((resolve, reject) => {
      // use mongoose to create the room
      Room.create(payload, (err, room) => {
        if (err) reject(err);

        // join the room using service functionjoinCode
        this.joinRoom(socket, room.joinCode).then(
          res => {
            // return the room
            resolve(room);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  },

  joinRoom(socket, joinCode) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      this.findRoom(joinCode).then(
        room => {
          // set the socket's room
          socket.room = room.joinCode;

          // join the appropriate socket
          socket.join(room.joinCode);

          // emit room information
          socket.emit('ROOM_INFO', room);

          // emit current queue and song to new user
          socket.emit('UPDATE_QUEUE', room.getSortedQueue());
          socket.emit('UPDATE_CURRENT_SONG', room.currentSong);

          resolve(room);
        },
        err => {
          reject(err);
        }
      );
    });
  },

  leaveRoom(socket) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      this.findRoom(socket.room).then(
        room => {
          // leave the appropriate socket
          socket.leave(room.joinCode);

          // clear the socket's storage
          socket.room = null;

          resolve(room);
        },
        err => {
          reject(err);
        }
      );
    });
  }
};
