const schema = require('@colyseus/schema');
const {BERRY_NAME, GROW_STATUS} = require('../../shared/enum');
const Schema = schema.Schema;

class Berry extends Schema {
  constructor(type, x, y) {
    super();
    this.descriptions = {
        SEED: `A ${BERRY_NAME[type]} was planted here.`,
        SPROUT: `A ${BERRY_NAME[type]} has sprouted.`,
        TALLER: `The ${BERRY_NAME[type]} plant is growing bigger.`,
        BLOOM: `This ${BERRY_NAME[type]} plant is in bloom! `,
        BERRY: `There are ${BERRY_NAME[type]}! `
    }

    this.assign({
      type: type,
      name: BERRY_NAME[type],
      status: GROW_STATUS.SEED,
      dialog: this.descriptions[GROW_STATUS.SEED],
      x: x,
      y: y
    });
  }

  changeDialog(status){
    this.dialog = this.descriptions[status];
  }
}

schema.defineTypes(Berry, {
  name: 'string',
  type: 'string',
  status: 'string',
  dialog: 'string',
  x: 'uint8',
  y: 'uint8'
});

module.exports = Berry;
