const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class Item extends Schema {
  constructor(id, type) {
    super();
    this.assign({
      id:id,
      type: type,
      stackable: false
    });
  }

  use(player, desiredPosition, state){

  }
}

schema.defineTypes(Item, {
  type: 'string',
  id: 'string',
  stackable: 'boolean'
});

module.exports = Item;
