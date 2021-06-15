const GameRoom = require('./game-room');
const { ZONES } = require('../shared/enum');

class Route1Room extends GameRoom{
    constructor(){
        super(ZONES.ROUTE1);
    }
}

module.exports = Route1Room;