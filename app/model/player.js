const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Item = require('./item');

const player = new Schema(
    {
      id: {
        type: String
      },
      x: {
        type: Number
      },
      y: {
        type: Number
      },
      orientation:{
          type: String
      },
      status:{
          type: String
      },
      name:{
          type: String
      },
      zone:{
        type: String
      },
      inventory: [Item]
    }
);

const Player = mongoose.model('Player', player);
module.exports = Player;
