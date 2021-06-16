const schema = require('@colyseus/schema');
const Message = require('../schema/message');
const Player = require('../schema/player');

class GameState extends schema.Schema {
  constructor(zone) {
    super();
    this.players = new schema.MapSchema();
    this.messages = new schema.ArraySchema();
    this.assign({
        zone: zone
    });
    this.data = require(`../../client/dist/asset/tilemap/${zone}.json`);
  }

  addMessage(name, payload){
    this.messages.push(new Message(name, payload));
  }
}

schema.defineTypes(GameState, {
    players: { map: Player },
    zone: 'string',
    messages: [Message]
});

module.exports = GameState;
