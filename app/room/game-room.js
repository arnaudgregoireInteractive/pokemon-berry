const colyseus = require("colyseus");
const command = require("@colyseus/command");
const GameState = require('./state/game-state');
const {OnDisposeCommand, OnItemMoveCommand, OnActionCommand, OnItemUseCommand, OnJoinCommand, OnLeaveCommand, OnCursorCommand, OnUpdateCommand, OnMessageCommand, OnInteractionCommand, OnLoadCommand} = require("./command/game-command");
const admin = require('firebase-admin');

class GameRoom extends colyseus.Room {

  constructor(zone){
    super();
    this.zone = zone;
  }

  async onCreate() {
    this.dispatcher = new command.Dispatcher(this);

    this.setState(new GameState(this.zone));
    this.dispatcher.dispatch(new OnLoadCommand());

    this.onMessage("cursor",(client, message) =>{
      this.dispatcher.dispatch(new OnCursorCommand(), {
        client,
        message
      });
    });

    this.onMessage("item-use",(client, message) =>{
      this.dispatcher.dispatch(new OnItemUseCommand(), {
        client,
        message
      });
    });

    this.onMessage("item-move",(client, message) =>{
      this.dispatcher.dispatch(new OnItemMoveCommand(), {
        client,
        message
      });
    });

    this.onMessage("message",(client, message) =>{
      this.dispatcher.dispatch(new OnMessageCommand(), {
        client,
        message
      });
    });

    this.onMessage("interaction",(client, message) =>{
      this.dispatcher.dispatch(new OnInteractionCommand(), {
        client,
        message
      });
    });

    this.onMessage("action",(client, message) =>{
      this.dispatcher.dispatch(new OnActionCommand(), {
        client,
        message
      });
    });
    
    this.setSimulationInterval((deltaTime) =>{
      this.dispatcher.dispatch(new OnUpdateCommand(), deltaTime);
    });
  }

  onJoin(client, options) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      client,
      options
    });
  }

  onLeave(client, consented) {
    this.dispatcher.dispatch(new OnLeaveCommand(), {
      client,
       consented
    });
  }

  async onAuth(client, options) {
    const token = await admin.auth().verifyIdToken(options.idToken);
    const user = await admin.auth().getUser(token.uid);
    return user;
  }


  onDispose() {
    this.dispatcher.dispatch(new OnDisposeCommand());
    this.dispatcher.stop();
  }
}
module.exports = GameRoom;
