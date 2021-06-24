const Command = require('@colyseus/command').Command;
const Player = require('../schema/player');
const {ORIENTATION, STATUS, KEY_STATUS, ACTION_TYPE, BERRY_STATUS } = require('../../shared/enum');
const Berry = require('../schema/berry');

class OnJoinCommand extends Command {
  execute({id,x,y,orientation,status}) {
    this.state.players[id] = new Player(id, x, y, orientation, status);
  }
}

class OnLeaveCommand extends Command {
  execute({client, consented}) {
    this.state.players.delete(client.sessionId);
  }
}

class OnCursorCommand extends Command{
  execute({client, message}){
    this.state.players.get(client.sessionId).cursors[message.key] = message.input;
  }
}

class OnMessageCommand extends Command{
  execute({client, message}){
    this.state.addMessage(client.sessionId, message.payload);
  }
}

class OnActionCommand extends Command{
  execute({client, message}){
    let player = this.state.players.get(client.sessionId);
    let desiredPosition = this.state.getDesiredPosition(player);

    switch (message.type) {
      case ACTION_TYPE.HARVEST:
        this.harvest(player, desiredPosition);
        break;
    
      default:
        break;
    }
  }

  harvest(player, desiredPosition){
    let berry = this.state.checkBerry(desiredPosition);
    if(berry){
      if(berry.status == BERRY_STATUS.BERRY){
        player.inventory.addItem(berry.type, true);
      }
      player.inventory.addItem(berry.type, true);
      this.state.berries.delete(berry.id);
    }
  }
}

class OnInteractionCommand extends Command{
  execute({client, message}){
    let player = this.state.players.get(client.sessionId);
    let desiredPosition = this.state.getDesiredPosition(player);
    let npc = this.state.checkNpc(desiredPosition);
    if(npc){
      client.send('dialog',{nickName : npc.properties[0].value, speech: npc.properties[1].value});
    }
    let berry = this.state.checkBerry(desiredPosition);
    if(berry){
      client.send('berry-interaction', {id: berry.id});
    }
  }
}

class OnUpdateCommand extends Command {

  execute(deltaTime) {
    this.state.players.forEach(player => {
      //console.log(player.moveCooldown);
      if (player.moveCooldown != 0){
        player.moveCooldown = Math.max(0, player.moveCooldown - deltaTime);
      }
      else{
        this.handleMovement(player);
      }
    });
  }

  handleMovement(player){
    if(player.cursors.LEFT == KEY_STATUS.UP && 
      player.cursors.RIGHT == KEY_STATUS.UP &&
      player.cursors.DOWN == KEY_STATUS.UP &&
      player.cursors.UP == KEY_STATUS.UP &&
      player.status != STATUS.IDLE){
        player.status = STATUS.IDLE;
    }
    else{
      if(player.cursors.LEFT == KEY_STATUS.DOWN){
        this.move(player, ORIENTATION.LEFT);
      }
      else if(player.cursors.RIGHT == KEY_STATUS.DOWN){
        this.move(player, ORIENTATION.RIGHT);
      }
      else if(player.cursors.DOWN == KEY_STATUS.DOWN){
        this.move(player, ORIENTATION.DOWN);
      }
      else if(player.cursors.UP == KEY_STATUS.DOWN){
        this.move(player, ORIENTATION.UP);
      }
    }
  }

  move(player, direction){
    player.orientation = direction;
    let desiredPosition = this.state.getDesiredPosition(player);

    //console.log(this.room.data.width * desiredY + desiredX);
    //console.log(`from ${player.x}, ${player.y} to ${desiredX}, ${desiredY}`);
    let link = this.state.checkLink(desiredPosition);
    if(link && link.properties[0].value != "SPAWN_POINT"){
      //console.log('move to', link.properties[0].value);
      let split = link.properties[0].value.split('-');
      //console.log(split);
      let client = this.room.clients.find(c=>{return c.id == player.id});
      client.send('link', {from: split[0], to : split[1]});
    }
    if(this.state.checkNpc(desiredPosition)){
      return;
    }
    if(this.state.checkBerry(desiredPosition)){
      return;
    }
    else{
      let accessibleFirstLayer = this.state.checkProperty(desiredPosition, 'walkable');
      let accessibleSecondLayer;
      if(accessibleFirstLayer){
        accessibleSecondLayer = this.state.checkBuilding(desiredPosition);
      }

      if(accessibleFirstLayer && accessibleSecondLayer){
          //console.log('move to ', desiredPosition.x, desiredPosition.y, accessibleFirstLayer);
          player.status = STATUS.MOVING;
          player.moveCooldown = 250;
          player.x = desiredPosition.x;
          player.y = desiredPosition.y;
          this.state.berries.forEach(berry =>{
            if(berry.ownerId == player.id){
              berry.grow();
            }
          });
      }
    }
  }
}

class OnItemUseCommand extends Command{
  execute({client, message}){
    let player = this.state.players.get(client.sessionId);
    let desiredPosition = this.state.getDesiredPosition(player);
    let item = player.inventory.slots.get(message.id);
    if(item && item.use(player, desiredPosition, this.state)){
      player.inventory.removeItem(item);
    }
  }
}


module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnUpdateCommand: OnUpdateCommand,
  OnCursorCommand: OnCursorCommand,
  OnMessageCommand: OnMessageCommand,
  OnInteractionCommand: OnInteractionCommand,
  OnItemUseCommand: OnItemUseCommand,
  OnActionCommand: OnActionCommand
};
