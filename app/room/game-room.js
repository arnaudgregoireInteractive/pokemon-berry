const colyseus = require("colyseus");
const command = require("@colyseus/command");
const {TILESET_PIXEL, ZONES, ORIENTATION, STATUS} = require('../shared/enum');
const GameState = require('./state/game-state');
const {OnItemMoveCommand, OnActionCommand, OnItemUseCommand, OnJoinCommand, OnLeaveCommand, OnCursorCommand, OnUpdateCommand, OnMessageCommand, OnInteractionCommand} = require("./command/game-command");

class GameRoom extends colyseus.Room {

  constructor(zone){
    super();
    this.zone = zone;
  }

  onCreate() {
    this.dispatcher = new command.Dispatcher(this);
    this.setState(new GameState(this.zone));
    this.spawnPoint = this.state.data.layers[2].objects.find(obj=>{return obj.properties[0].value == "SPAWN_POINT"});

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
    let x;
    let y;
    //console.log(options);
    if(options.from){
      let linkStr = `${this.zone}-${options.from}`;
      //console.log(this.state.data.layers[2].objects);
      let link = this.state.data.layers[2].objects.find(obj =>{return obj.properties[0].value == linkStr});
      //console.log(linkStr, link);
      x = link.x / TILESET_PIXEL;
      y = link.y / TILESET_PIXEL;
    }
    if(x === undefined){
      x = this.spawnPoint.x/TILESET_PIXEL;
    }
    if(y === undefined){
      y = this.spawnPoint.y/TILESET_PIXEL;
    }
    this.dispatcher.dispatch(new OnJoinCommand(), {
        id: client.sessionId,
        x: x,
        y: y,
        orientation: ORIENTATION.DOWN,
        status: STATUS.IDLE
    });
  }

  onLeave(client, consented) {
    this.dispatcher.dispatch(new OnLeaveCommand(), {
      client,
       consented
    });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
module.exports = GameRoom;
