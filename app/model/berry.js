const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Berry = new Schema(
    {
      id: {
        type: String
      },
      ownerId: {
        type: String
      },
      type: {
        type: String
      },
      status: {
        type: String
      },
      step: {
        type: Number
      },
      x: {
        type: Number
      },
      y: {
        type: Number
      }
    }
);

module.exports = Berry;
