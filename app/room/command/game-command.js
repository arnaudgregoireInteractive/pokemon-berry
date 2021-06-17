const Command = require('@colyseus/command').Command;
const Player = require('../schema/player');
const {ORIENTATION, STATUS, KEY_STATUS, TILESET_PIXEL} = require('../../shared/enum');

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

class OnInteractionCommand extends Command{
  execute({client, message}){
    let player = this.state.players.get(client.sessionId);
    let desiredX = player.x;
    let desiredY = player.y;

    switch (player.orientation) {
      case ORIENTATION.LEFT:
        desiredX -= 1;
        break;

      case ORIENTATION.UP:
        desiredY -= 1;
        break;

      case ORIENTATION.RIGHT:
        desiredX += 1;
        break;

      case ORIENTATION.DOWN:
        desiredY += 1;
        break;
    
      default:
        break;
    }

    let npc;
    for (let i = 0; i < this.state.data.layers[3].objects.length; i++) {
      const obj = this.state.data.layers[3].objects[i];
      if(Math.floor(obj.x / TILESET_PIXEL) == desiredX && Math.floor(obj.y / TILESET_PIXEL) == desiredY){
        npc = obj;
      }
    }
    if(npc){
      client.send('dialog',{nickName : npc.properties[0].value, speech: npc.properties[1].value});
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
    let desiredX = player.x;
    let desiredY = player.y;
    switch (direction) {
      case ORIENTATION.LEFT:
        desiredX -= 1;
        break;

      case ORIENTATION.UP:
        desiredY -= 1;
        break;

      case ORIENTATION.RIGHT:
        desiredX += 1;
        break;

      case ORIENTATION.DOWN:
        desiredY += 1;
        break;
    
      default:
        break;
    }
    //console.log(this.room.data.width * desiredY + desiredX);
    //console.log(`from ${player.x}, ${player.y} to ${desiredX}, ${desiredY}`);
    let link = this.checkLinks(desiredX, desiredY);
    if(link && link.properties[0].value != "SPAWN_POINT"){
      //console.log('move to', link.properties[0].value);
      let split = link.properties[0].value.split('-');
      //console.log(split);
      let client = this.room.clients.find(c=>{return c.id == player.id});
      client.send('link', {from: split[0], to : split[1]});
    }
    if(this.checkNpc(desiredX, desiredY)){
      return;
    }
    else{
      if(desiredX >= 0 && desiredX < this.state.data.width && desiredY >=0 && desiredY < this.state.data.height){
        let firstLayerId = this.state.data.layers[0].data[this.state.data.width * desiredY + desiredX];
        let accessibleFirstLayer = false;
        let secondLayerId =  this.state.data.layers[1].data[this.state.data.width * desiredY + desiredX];
        //console.log('first layer id', firstLayerId);
        let accessibleSecondLayer = true;
        if(firstLayerId != 0){
          let tile = this.room.collider[0].tiles.find(t=>{return t.id == firstLayerId - this.room.collider[0].firstgid});
          if(tile){
            let walkableProperty = tile.properties.find(p=>{return p.name == "walkable"});
            if(walkableProperty){
              accessibleFirstLayer = walkableProperty.value;
            }
          }
        }
        else{
          accessibleFirstLayer = true;
        }
        if(secondLayerId != 0 && accessibleFirstLayer){
          //console.log(secondLayerId);
          let tile = this.room.collider[1].tiles.find(t=>{return t.id == secondLayerId - this.room.collider[1].firstgid});
          if(tile){
            //console.log(tile);
            let collidesProperty = tile.properties.find(p=>{return p.name == "collides"});
            if(collidesProperty){
              accessibleSecondLayer = !collidesProperty.value;
            }
          }
        }
        else{
          accessibleSecondLayer = true;
        }
        if(accessibleFirstLayer && accessibleSecondLayer){
          //console.log('move to ', desiredX, desiredY, accessibleFirstLayer);
          player.status = STATUS.MOVING;
          player.moveCooldown = 250;
          player.x = desiredX;
          player.y = desiredY;
        }
      }
    }
  }

  checkLinks(desiredX, desiredY){
    for (let i = 0; i < this.state.data.layers[2].objects.length; i++) {
      const obj = this.state.data.layers[2].objects[i];
      if(obj.x / TILESET_PIXEL == desiredX && obj.y / TILESET_PIXEL == desiredY){
        return obj;
      }
    }
  }

  checkNpc(desiredX, desiredY){
    for (let i = 0; i < this.state.data.layers[3].objects.length; i++) {
      const obj = this.state.data.layers[3].objects[i];
      if(Math.floor(obj.x / TILESET_PIXEL) == desiredX && Math.floor(obj.y / TILESET_PIXEL) == desiredY){
        return obj;
      }
    }
  }
}


module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnUpdateCommand: OnUpdateCommand,
  OnCursorCommand: OnCursorCommand,
  OnMessageCommand: OnMessageCommand,
  OnInteractionCommand: OnInteractionCommand
};
