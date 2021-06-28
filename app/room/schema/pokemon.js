const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class Pokemon extends Schema {
  constructor(id, name, x, y, orientation, status, power, types) {
    super();
    this.assign({
        id: id,
        name: name,
        x: x,
        y: y,
        orientation: orientation,
        status: status,
        power: power,
    });
    this.types = schema.ArraySchema();
    types.forEach(t => {
        this.types.push(t);
    });
  }

  save(){
    return {
        id: this.id,
        name: this.name,
        x: this.x,
        y: this.y,
        orientation: this.orientation,
        status: this.status,
        power: this.power,
        types: this.types
    }
  }
}

schema.defineTypes(Pokemon, {
  id: 'string',
  name: 'string',
  x: 'uint8',
  y: 'uint8',
  orientation: 'string',
  status: 'string',
  power: 'uint16',
  types: ['string']
});

module.exports = Pokemon;
