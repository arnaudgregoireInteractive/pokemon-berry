const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class Item extends Schema {
  constructor(id, type, index) {
    super();
    this.assign({
      id:id,
      type: type,
      index: index,
      stackable: false
    });
  }

  use(player, desiredPosition, state){

  }
}

schema.defineTypes(Item, {
  type: 'string',
  id: 'string',
  index: 'uint8',
  stackable: 'boolean'
});

module.exports = Item;
