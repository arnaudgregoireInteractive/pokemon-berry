const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class Message extends Schema {
  constructor(name, payload) {
    super();
    this.assign({
      name: name,
      payload:payload
    });
  }
}

schema.defineTypes(Message, {
  name: 'string',
  payload: 'string'
});

module.exports = Message;
