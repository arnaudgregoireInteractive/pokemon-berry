const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const {KEY_STATUS} = require('../../shared/enum');
const Inventory = require('./inventory');

class Player extends Schema {
  constructor(id, zone, name, x, y, orientation, status, money, inventory) {
    super();
    this.assign({
      id: id,
      x: x,
      y: y,
      orientation:orientation,
      status:status,
      name: name,
      zone: zone,
      money: money
    });
    this.inventory = new Inventory(50, inventory);
    this.moveCooldown = 0;
    this.cursors = {
      LEFT: KEY_STATUS.UP,
      UP: KEY_STATUS.UP,
      RIGHT: KEY_STATUS.UP,
      DOWN: KEY_STATUS.UP
    };
  }

  save(){
    return {
      id:  this.id,
      zone: this.zone,
      name: this.name,
      x: this.x,
      y: this.y,
      orientation: this.orientation,
      status: this.status,
      money: this.money,
      inventory: this.inventory.save()
    }
  }
}

schema.defineTypes(Player, {
  id: 'string',
  zone: 'string',
  name: 'string',
  x: 'uint8',
  y: 'uint8',
  orientation: 'string',
  status: 'string',
  money: 'uint64',
  inventory: Inventory
});

module.exports = Player;
