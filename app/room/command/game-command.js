const Command = require('@colyseus/command').Command;
const Player = require('../schema/player');
const {ORIENTATION, STATUS} = require('../../shared/enum');

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

class OnMoveCommand extends Command{
  execute({client, message}){
    let player = this.state.players.get(client.sessionId);
    if(player.status == STATUS.IDLE){
      let desiredX = player.x;
      let desiredY = player.y;
      switch (message.direction) {
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
  
      if(desiredX >= 0 && desiredX < this.room.data.width && desiredY >=0 && desiredY < this.room.data.height){
  
        let firstLayerId = this.room.data.layers[0].data[this.room.data.width * desiredY + desiredX];
        let accessibleFirstLayer = false;
        let secondLayerId =  this.room.data.layers[1].data[this.room.data.width * desiredY + desiredX];
        //console.log('second layer id', secondLayerId);
        let accessibleSecondLayer = true;
        if(firstLayerId != 0){
          let tile = this.room.data.tilesets[0].tiles.find(t=>{return t.id == firstLayerId - this.room.data.tilesets[0].firstgid});
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
          let tile = this.room.data.tilesets[1].tiles.find(t=>{return t.id == secondLayerId - this.room.data.tilesets[1].firstgid});
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
          player.orientation = message.direction;
        }
      }
    }
  }
}

class OnUpdateCommand extends Command {
  execute(deltaTime) {
    this.state.players.forEach(player => {
      if (player.moveCooldown != 0){
        player.moveCooldown = Math.max(0, player.moveCooldown - deltaTime);
        if(player.moveCooldown <= 0){
          player.status = STATUS.IDLE;
        }
      }
    });
  }
}

class OnIdleCommand extends Command{
  execute({client, message}){
    this.state.players.get(client.sessionId).status = STATUS.IDLE;
  }
}

module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnMoveCommand: OnMoveCommand,
  OnUpdateCommand: OnUpdateCommand,
  OnIdleCommand: OnIdleCommand
};
