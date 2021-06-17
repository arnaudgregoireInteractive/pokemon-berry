import Phaser from 'phaser';
import GameScene from '../scene/game-scene';
import UIScene from '../scene/ui-scene';
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { ZONES } from '../../../shared/enum';

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
      this.room.state.messages.onAdd = this.component.refs.chat.receiveMessage;
      this.room.state.players.onRemove = (player, key) => this.onPlayerRemove(player, key);
      this.room.onMessage("link", (message) => {
        this.handleLink(message);
      });
      this.room.onMessage("dialog", (message) => {
        this.handleDialog(message);
      });
    }
  }

  onPlayerAdd(player){
    if (_client.auth._id == player.id) {
      this.player = player;
    }
    player.onChange = ((changes) => {
      changes.forEach((change) => this.handlePlayerChange(change, player));
    });

    this.handlePlayerAdd(player);
  }

  onPlayerRemove(player, key){
    if(this.game && this.game.scene && this.game.scene.getScene('game-scene') && this.game.scene.getScene('game-scene').playerManager){
      this.game.scene.getScene('game-scene').playerManager.removePlayer(key);
    }
  }

  handlePlayerChange(change, player){
    //console.log(change);
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

  handleDialog(message){
    this.game.scene.getScene('ui-scene').renderDialog(message);
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
}
