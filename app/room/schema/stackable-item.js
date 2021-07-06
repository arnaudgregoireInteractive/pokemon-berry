const schema = require('@colyseus/schema');
const Item = require('./item');

class StackableItem extends Item {
  constructor(id, type, quantity) {
    super(id, type);
    this.assign({
        quantity: quantity,
        stackable: true
    });
  }
}

schema.defineTypes(StackableItem, {
  quantity: 'uint16'
});

module.exports = StackableItem;
