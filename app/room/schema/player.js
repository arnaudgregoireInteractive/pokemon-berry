const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const {KEY_STATUS} = require('../../shared/enum');
const Inventory = require('./inventory');

class Player extends Schema {
  constructor(id, x, y, orientation, status) {
    super();
    this.assign({
      id: id,
      x: x,
      y: y,
      orientation:orientation,
      status:status
    });
    this.inventory = new Inventory(48);
    this.moveCooldown = 0;
    this.cursors = {
      LEFT: KEY_STATUS.UP,
      UP: KEY_STATUS.UP,
      RIGHT: KEY_STATUS.UP,
      DOWN: KEY_STATUS.UP
    };
  }
}

schema.defineTypes(Player, {
  id: 'string',
  x: 'uint8',
  y: 'uint8',
  orientation: 'string',
  status: 'string',
  inventory: Inventory
});

module.exports = Player;
