const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Berry = require('./berry');

const zone = new Schema(
    {
      id: {
        type: String
      },
      berries: [Berry]
    }
);

const Zone = mongoose.model('Zone', zone);
module.exports = Zone;
