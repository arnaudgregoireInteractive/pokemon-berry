const schema = require('@colyseus/schema');
const Berry = require('./berry');
const StackableItem = require('./stackable-item');
const uniqid = require('uniqid');
const { BERRY_STATUS } = require('../../shared/enum');

class StackableBerry extends StackableItem {
  constructor(id, type, quantity) {
    super(id, type, quantity);
  }

    use(player, desiredPosition, state){
        super.use(player, desiredPosition, state);
        if(!state.checkBerry(desiredPosition) && state.checkProperty(desiredPosition, 'arable')){
            let berry = new Berry(uniqid('berry-'), this.type, desiredPosition.x, desiredPosition.y, player.id, BERRY_STATUS.SEED, 10);
            state.berries.set(berry.id, berry);
            return true;
        }
        else{
            return false;
        }
    }
}

schema.defineTypes(StackableBerry, {
});

module.exports = StackableBerry;
