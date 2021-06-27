const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const berry = new Schema(
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

const Berry = mongoose.model('Berry', berry);
module.exports = Berry;
