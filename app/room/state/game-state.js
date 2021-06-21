const schema = require('@colyseus/schema');
const Message = require('../schema/message');
const Player = require('../schema/player');
const Berry = require('../schema/berry');
const {ORIENTATION, TILESET_PIXEL} = require('../../shared/enum');
const collider = require('../../shared/collider.json').tilesets;

class GameState extends schema.Schema {
  constructor(zone) {
    super();
    this.players = new schema.MapSchema();
    this.berries = new schema.MapSchema();
    this.messages = new schema.ArraySchema();
    this.assign({
        zone: zone
    });
    this.data = require(`../../client/dist/asset/tilemap/${zone}.json`);
    this.collider = collider;
  }

  addMessage(name, payload){
    this.messages.push(new Message(name, payload));
  }

  checkNpc(desiredPosition){
    for (let i = 0; i < this.data.layers[3].objects.length; i++) {
      const obj = this.data.layers[3].objects[i];
      if(Math.floor(obj.x / TILESET_PIXEL) == desiredPosition.x && Math.floor(obj.y / TILESET_PIXEL) == desiredPosition.y){
        return obj;
      }
    }
  }

  checkLink(desiredPosition){
    for (let i = 0; i < this.data.layers[2].objects.length; i++) {
      const obj = this.data.layers[2].objects[i];
      if(obj.x / TILESET_PIXEL == desiredPosition.x && obj.y / TILESET_PIXEL == desiredPosition.y){
        return obj;
      }
    }
  }

  checkBuilding(desiredPosition){
    let accessibleSecondLayer = true;
    let secondLayerId =  this.data.layers[1].data[this.data.width * desiredPosition.y + desiredPosition.x];
    //console.log('first layer id', firstLayerId);
    if(secondLayerId != 0){
      //console.log(secondLayerId);
      let tile = this.collider[1].tiles.find(t=>{return t.id == secondLayerId - this.collider[1].firstgid});
      if(tile){
        //console.log(tile);
        let collidesProperty = tile.properties.find(p=>{return p.name == "collides"});
        if(collidesProperty){
          accessibleSecondLayer = !collidesProperty.value;
        }
      }
    }
    return accessibleSecondLayer;
  }

  checkProperty(desiredPosition, property){
    let accessibleFirstLayer = false;
    if(desiredPosition.x >= 0 && desiredPosition.x < this.data.width && desiredPosition.y >=0 && desiredPosition.y < this.data.height){
      let firstLayerId = this.data.layers[0].data[this.data.width * desiredPosition.y + desiredPosition.x];

      if(firstLayerId != 0){
        let tile = this.collider[0].tiles.find(t=>{return t.id == firstLayerId - this.collider[0].firstgid});
        if(tile){
          let walkableProperty = tile.properties.find(p=>{return p.name == property});
          if(walkableProperty){
            accessibleFirstLayer = walkableProperty.value;
          }
        }
      }
    }
    return accessibleFirstLayer;
  }

  checkBerry(desiredPosition){
    let possibleBerry;
    this.berries.forEach(berry=>{
      if(berry.x == desiredPosition.x && berry.y == desiredPosition.y){
        possibleBerry = berry;
      }
    });
    return possibleBerry;
  }
  
  getDesiredPosition(player){

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

    return {
      x:desiredX,
      y:desiredY
    }
  }
}

schema.defineTypes(GameState, {
    players: { map: Player },
    zone: 'string',
    messages: [Message],
    berries: {map: Berry}
});

module.exports = GameState;
