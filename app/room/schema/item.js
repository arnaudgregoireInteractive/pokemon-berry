const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const uniqid = require('uniqid');

class Item extends Schema {
  constructor(type, index) {
    super();
    this.assign({
      id: uniqid(),
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
