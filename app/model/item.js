const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Item = new Schema(
    {
      id: {
        type: String
      },
      type: {
        type: String
      },
      index: {
        type: Number
      },
      quantity: {
        type: Number
      }
    }
);

module.exports = Item;
