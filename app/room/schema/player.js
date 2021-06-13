const schema = require('@colyseus/schema');
const Schema = schema.Schema;

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
    this.moveCooldown = 0;
  }
}

schema.defineTypes(Player, {
  id: 'string',
  x: 'uint8',
  y: 'uint8',
  orientation: 'string',
  status: 'string'
});

module.exports = Player;
