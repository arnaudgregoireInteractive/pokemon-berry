const Command = require('@colyseus/command').Command;
const Player = require('../schema/player');
const PlayerModel = require('../../model/player');
const {ORIENTATION, STATUS, KEY_STATUS, ACTION_TYPE, BERRY_STATUS, TILESET_PIXEL, BERRY_TYPE, NPC_TYPE } = require('../../shared/enum');
const Zone = require('../../model/zone');
const Berry = require('../schema/berry');
const uniqid = require('uniqid');

class Utils{
  static savePlayer(client, state){
    let player = state.players.get(client.auth.uid);
    return PlayerModel.find({id: player.id}, (err, docs)=>{
      if(err){
        console.log(err);
        return err;
      }
      else{
        if(docs.length == 0){
          PlayerModel.create(player.save());
        }
        else{
          docs.forEach(doc =>{
            let save = player.save();
            doc.id = save.id;
            doc.x = save.x;
            doc.y = save.y;
            doc.orientation = save.orientation;
            doc.status = save.status;
            doc.inventory = save.inventory;
            doc.name = save.name;
            doc.zone = save.zone;
            doc.money = save.money;
            doc.save().catch(err=>{console.log(err)});

          }); 
        }
      }
    });
  }
}

class OnLoadCommand extends Command{
  execute(){
    this.state.spawnPoint = this.state.data.layers[2].objects.find(obj=>{return obj.properties[0].value == "SPAWN_POINT"});
    Zone.find({id: this.room.zone},(err, docs)=>{
      if(err){
        console.log(err);
        return err;
      }
      else{
        //console.log(docs);
        docs.forEach(doc=>{
          doc.berries.forEach(b=>{
            let berry = new Berry(b.id, b.type, b.x, b.y, b.ownerId, b.status, b.step);
            this.state.berries.set(berry.id, berry);
          });
        });
      }
    });
  }
}

class OnJoinCommand extends Command {
  execute({client, options}) {

    PlayerModel.findOne({id: client.auth.uid}, (err, doc)=>{
      if(doc){
        let player = new Player(doc.id, this.state.zone, doc.name, doc.x, doc.y, doc.orientation, doc.status, doc.money, doc.inventory);
          this.state.players.set(
            client.auth.uid,
            player);
          
          if(doc.zone != this.state.zone){
            let linkStr = `${this.state.zone}-${doc.zone}`;
            let link = this.state.data.layers[2].objects.find(obj =>{return obj.properties[0].value == linkStr});
            player.x = link.x / TILESET_PIXEL;
            player.y = link.y / TILESET_PIXEL;
          }
      }
      else{
        this.state.players.set(client.auth.uid,
          new Player(client.auth.uid, this.state.zone, client.auth.displayName, this.state.spawnPoint.x/TILESET_PIXEL, this.state.spawnPoint.y/TILESET_PIXEL, ORIENTATION.DOWN, STATUS.IDLE, 5, [{
            id: uniqid('berry-'),
            type: BERRY_TYPE.CHERI_BERRY,
            quantity: 2
          }]));
      }
    });
  }
}

class OnLeaveCommand extends Command {
  execute({client, consented}) {
    Utils.savePlayer(client, this.state);
    this.state.players.delete(client.auth.uid);
  }
}

class OnCursorCommand extends Command{
  execute({client, message}){
    this.state.players.get(client.auth.uid).cursors[message.key] = message.input;
  }
}

class OnMessageCommand extends Command{
  execute({client, message}){
    this.state.addMessage(client.auth.displayName, message.payload);
  }
}

class OnActionCommand extends Command{
  execute({client, message}){
    let player = this.state.players.get(client.auth.uid);
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
    let player = this.state.players.get(client.auth.uid);
    let desiredPosition = this.state.getDesiredPosition(player);
    let npc = this.state.checkNpc(desiredPosition);
    if(npc){
      client.send('prompt',{title : npc.properties[0].value, info: npc.properties[1].value});
    }
    let berry = this.state.checkBerry(desiredPosition);
    if(berry){
      client.send('prompt',{title : '', info: berry.description});
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

  async move(player, direction){
    player.orientation = direction;
    let desiredPosition = this.state.getDesiredPosition(player);

    //console.log(this.room.data.width * desiredY + desiredX);
    //console.log(`from ${player.x}, ${player.y} to ${desiredX}, ${desiredY}`);
    let link = this.state.checkLink(desiredPosition);
    if(link && link.properties[0].value != "SPAWN_POINT"){
      //console.log('move to', link.properties[0].value);
      let split = link.properties[0].value.split('-');
      //console.log(split);
      let client = this.room.clients.find(c=>{return c.auth.uid == player.id});
      //await Utils.savePlayer(client, this.state);
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
    let player = this.state.players.get(client.auth.uid);
    let desiredPosition = this.state.getDesiredPosition(player);
    let item = player.inventory.slots.get(message.id);
    if(item && item.use(player, desiredPosition, this.state)){
      player.inventory.removeItem(item);
    }
  }
}

class OnDisposeCommand extends Command{
  execute(){
    let berries = [];
    this.state.berries.forEach(berry=>{
      berries.push({
        id: berry.id,
        type: berry.type,
        x: berry.x,
        y: berry.y,
        ownerId: berry.ownerId,
        step: berry.step,
        status: berry.status
      });
    });
    Zone.find({id: this.room.zone},(err, docs)=>{
      if(err){
        console.log(err);
        return err;
      }
      else{
        if(docs.length == 0){
          Zone.create({
            id: this.room.zone,
            berries: berries
          });
        }
        else{
          docs.forEach(doc=>{
            doc.berries = berries;
            doc.save();
          });
        }
      }
    });
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
  OnActionCommand: OnActionCommand,
  OnDisposeCommand: OnDisposeCommand,
  OnLoadCommand: OnLoadCommand
};
