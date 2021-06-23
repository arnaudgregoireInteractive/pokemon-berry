const schema = require('@colyseus/schema');
const Berry = require('./berry');
const StackableItem = require('./stackable-item');

class StackableBerry extends StackableItem {
  constructor(type, index, quantity) {
    super(type, index, quantity);
  }

    use(player, desiredPosition, state){
        super.use(player, desiredPosition, state);
        if(!state.checkBerry(desiredPosition) && state.checkProperty(desiredPosition, 'arable')){
            let berry = new Berry(this.type, desiredPosition.x, desiredPosition.y, player.id);
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
