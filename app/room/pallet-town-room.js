const GameRoom = require('./game-room');
const { ZONES } = require('../shared/enum');

class PalletTownRoom extends GameRoom{
    constructor(){
        super(ZONES.PALLET_TOWN);
    }
}

module.exports = PalletTownRoom;