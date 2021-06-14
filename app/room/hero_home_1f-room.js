const GameRoom = require('./game-room');
const { ZONES } = require('../shared/enum');

class HeroHome1fRoom extends GameRoom{
    constructor(){
        super(ZONES.HERO_HOME_1F);
    }
}

module.exports = HeroHome1fRoom;