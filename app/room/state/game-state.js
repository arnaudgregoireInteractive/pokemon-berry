const schema = require('@colyseus/schema');
const Player = require('../schema/player');

class GameState extends schema.Schema {
  constructor(zone) {
    super();
    this.players = new schema.MapSchema();
    this.assign({
        zone: zone
    });
    this.data = require(`../../client/dist/asset/tilemap/${zone}.json`);
  }
}

schema.defineTypes(GameState, {
    players: { map: Player },
    zone: 'string'
});

module.exports = GameState;
