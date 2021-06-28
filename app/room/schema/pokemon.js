const schema = require('@colyseus/schema');
const { POKEMON_NAME, RARITY, POKEMON_TYPE } = require('../../shared/enum');
const Schema = schema.Schema;

class Pokemon extends Schema {
  constructor(id, x, y, orientation, status, power, name, rarity, types) {
    super();
    this.assign({
        id: id,
        name: name,
        x: x,
        y: y,
        orientation: orientation,
        status: status,
        power: power,
        rarity: rarity
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
        types: this.types,
        rarity: this.rarity
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
  rarity: 'string',
  power: 'uint16',
  types: ['string']
});

class Rattata extends Pokemon{
    constructor(id, x, y, orientation, status, power){
        super(id, x, y, orientation, status, power, POKEMON_NAME.RATTATA, RARITY.COMMON, [POKEMON_TYPE.NORMAL]);
    }
}

module.exports = {Pokemon, Rattata};
