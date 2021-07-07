const schema = require('@colyseus/schema');
const { ITEM_PRICE } = require('../../shared/enum');
const Schema = schema.Schema;

class Item extends Schema {
  constructor(id, type) {
    super();
    this.assign({
      id:id,
      type: type,
      stackable: false,
      price: ITEM_PRICE[type]
    });
  }

  use(player, desiredPosition, state){

  }
}

schema.defineTypes(Item, {
  type: 'string',
  id: 'string',
  stackable: 'boolean',
  price: 'uint16'
});

module.exports = Item;
