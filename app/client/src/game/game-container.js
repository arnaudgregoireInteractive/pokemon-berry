import Phaser from 'phaser';
import GameScene from '../scene/game-scene';
import UIScene from '../scene/ui-scene';
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { ITEM_ACTION, ZONES, ACTION_TYPE } from '../../../shared/enum';

export default class GameContainer {
  constructor(component) {
    this.component = component;
    this.container = component.container;
    this.game = undefined;
    this.room = undefined;
    this.player = undefined;
    this.initialize();
  }

  initialize(){
    try {
      window._client.joinOrCreate(ZONES.PALLET_TOWN, {/* options */}).then(room=>{
          this.room = room;
          this.initializeEvents();
          this.room.onStateChange.once((state) =>{
            this.game = new Phaser.Game({
              type: Phaser.CANVAS,
              mode: Phaser.Scale.FIT,
              width: 1800,
              height: 900,
              parent: this.container.current,
              scene: [GameScene, UIScene],
              pixelArt: true,
              plugins: {
                global: [{
                  key: 'rexMoveTo',
                  plugin: MoveToPlugin,
                  start: true
                }],
                scene:[{
                  key: 'rexUI',
                  plugin: RexUIPlugin,
                  mapping: 'rexUI'
                }]
              }
            });
            this.game.scene.start('game-scene', room);
            this.game.scene.start('ui-scene');
          });
        });
    } catch (e) {
      console.error("join error", e);
      alert("error");
    }
  }

  initializeEvents(){
    if(this.room){
      this.room.state.players.onAdd = (player) => this.onPlayerAdd(player);
      this.room.state.players.onRemove = (player, key) => this.onPlayerRemove(player, key);

      this.room.state.berries.onAdd = (berry) => this.onBerryAdd(berry);
      this.room.state.berries.onRemove = (berry, key) => this.onBerryRemove(berry, key);

      this.room.state.messages.onAdd = this.component.refs.chat.receiveMessage;
      
      this.room.onMessage("link", (message) => {
        this.handleLink(message);
      });
      this.room.onMessage("dialog", (message) => {
        this.handleDialog(message);
      });
      this.room.onMessage("berry-interaction", (message) =>{
        this.handleBerryInteraction(message);
      });
    }
  }

  onBerryAdd(berry){
    berry.onChange = ((changes) => {
      changes.forEach((change) => this.handleBerryChange(change, berry));
    });

    this.handleBerryAdd(berry);
  }

  onBerryRemove(berry, key){
    if(this.game && this.game.scene && this.game.scene.getScene('game-scene') && this.game.scene.getScene('game-scene').berryManager){
      this.game.scene.getScene('game-scene').berryManager.removeBerry(key);
    }
  }

  handleBerryChange(change, berry){
    if(this.game && this.game.scene && this.game.scene.getScene('game-scene') && this.game.scene.getScene('game-scene').berryManager){
      this.game.scene.getScene('game-scene').berryManager.handleBerryChange(berry, change);
    }
  }

  handleBerryAdd(berry){
    if(this.game && this.game.scene && this.game.scene.getScene('game-scene') && this.game.scene.getScene('game-scene').berryManager){
      this.game.scene.getScene('game-scene').berryManager.addBerry(berry);
    }
  }

  onPlayerAdd(player){
    //console.log(this.room.sessionId);
    if (player.id == this.room.sessionId) {
      this.player = player;
      this.player.inventory.slots.onAdd = (item) => this.onInventoryAdd(item);
      this.player.inventory.slots.onRemove = (item, key) => this.onInventoryRemove(key);
    }
    player.onChange = ((changes) => {
      changes.forEach((change) => this.handlePlayerChange(change, player));
    });

    this.handlePlayerAdd(player);
  }

  onInventoryAdd(item){
    item.onChange = ((changes) => {
      changes.forEach((change) => this.onInventoryChange(change, item));
    });

    if(this.game && this.game.scene && this.game.scene.getScene('ui-scene')){
      this.game.scene.getScene('ui-scene').addItem(item);
    }
  }

  onInventoryRemove(key){
    if(this.game && this.game.scene && this.game.scene.getScene('ui-scene')){
      this.game.scene.getScene('ui-scene').removeItem(key);
    }
  }

  onInventoryChange(change, item){
    if(this.game && this.game.scene && this.game.scene.getScene('ui-scene')){
      this.game.scene.getScene('ui-scene').handleInventoryChange(change, item);
    }
  }

  onPlayerRemove(player, key){
    if(this.game && this.game.scene && this.game.scene.getScene('ui-scene') && this.game.scene.getScene('game-scene').playerManager){
      this.game.scene.getScene('game-scene').playerManager.removePlayer(key);
    }
  }

  handlePlayerChange(change, player){
    //console.log(change);
    if(this.game && this.game.scene && this.game.scene.getScene('ui-scene')){
      this.game.scene.getScene('ui-scene').clearUI();
    }
    if(this.game && this.game.scene && this.game.scene.getScene('game-scene') && this.game.scene.getScene('game-scene').playerManager){
      this.game.scene.getScene('game-scene').playerManager.handlePlayerChange(player, change);
    }
  }
  
  handlePlayerAdd(player){
    if(this.game && this.game.scene && this.game.scene.getScene('game-scene') && this.game.scene.getScene('game-scene').playerManager){
      this.game.scene.getScene('game-scene').playerManager.addPlayer(player);
    }
  }

  handlePlayerInput(message){
    this.room.send('cursor', message);
  }

  handleInteractionInput(){
    this.room.send('interaction');
  }

  sendMessage(message){
    this.room.send('message', {payload : message});
  }

  handleAction(message){
    this.room.send('action', message);    
  }

  handleDialog(message){
    this.game.scene.getScene('ui-scene').renderDialog(message.nickName, message.speech);
  }
  
  handleBerryInteraction(message){ 
    let berry = this.room.state.berries.get(message.id);
    this.game.scene.getScene('ui-scene').renderDialog('', berry.dialog, [ACTION_TYPE.HARVEST]);
  }

  handleLink(message){
    //console.log('handle link', message.to);
    this.room.removeAllListeners();
    this.room.leave();
    window._client.joinOrCreate(message.to, {from: message.from}).then(room=>{
      this.room = room;
      this.initializeEvents();
      this.room.onStateChange.once((state) =>{
        this.game.scene.getScene('game-scene').scene.restart(room);
      });
    });
  } catch (e) {
    console.error("join error", e);
    alert("error");
  }

  showInventory(){
    //console.log(this.player.inventory);
    this.game.scene.getScene('ui-scene').renderInventory(this.player.inventory);
  }

  handleItemInteraction(message){
    switch (message.action) {
      case ITEM_ACTION.USE:
        this.room.send('item-use', {id: message.id});
        break;
    
      default:
        break;
    }
  }
}
