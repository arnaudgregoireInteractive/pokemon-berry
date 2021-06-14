const GameRoom = require('./game-room');
const { ZONES } = require('../shared/enum');

class OakLab1fRoom extends GameRoom{
    constructor(){
        super(ZONES.OAKS_LAB_1F);
    }
}

module.exports = OakLab1fRoom;