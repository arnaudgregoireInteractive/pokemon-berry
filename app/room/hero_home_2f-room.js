const GameRoom = require('./game-room');
const { ZONES } = require('../shared/enum');

class HeroHome2fRoom extends GameRoom{
    constructor(){
        super(ZONES.HERO_HOME_2F);
    }
}

module.exports = HeroHome2fRoom;