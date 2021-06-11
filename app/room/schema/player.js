const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class Player extends Schema {
  constructor(id, x, y, orientation) {
    super();
    this.assign({
      id: id,
      x: x,
      y: y,
      orientation:orientation
    });
  }
}

schema.defineTypes(Player, {
  id: 'string',
  x: 'uint8',
  y: 'uint8',
  orientation: 'string'
});

module.exports = Player;
