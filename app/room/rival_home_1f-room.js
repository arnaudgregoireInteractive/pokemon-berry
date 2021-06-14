const GameRoom = require('./game-room');
const { ZONES } = require('../shared/enum');

class RivaHome1fRoom extends GameRoom{
    constructor(){
        super(ZONES.RIVAL_HOME_1F);
    }
}

module.exports = RivaHome1fRoom;