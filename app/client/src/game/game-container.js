import Phaser from 'phaser';
import GameScene from '../scene/game-scene';
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';
import { STATUS } from '../../../shared/enum';

export default class GameContainer {
  constructor(container) {
    this.container = container;
    this.game = undefined;
    this.room = undefined;
    this.player = undefined;
    this.initialize();
  }

  initialize(){
    try {
      window._client.joinOrCreate("room", {/* options */}).then(room=>{
          this.room = room;
          this.initializeEvents();
          this.room.onStateChange.once((state) =>{
            this.game = new Phaser.Game({
              type: Phaser.CANVAS,
              width: 1800,
              height: 900,
              parent: this.container.current,
              scene: [GameScene],
              pixelArt: true,
              plugins: {
                global: [{
                  key: 'rexMoveTo',
                  plugin: MoveToPlugin,
                  start: true
                }]
              }
            });
            this.game.scene.start('game-scene', room);
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
    console.log(change);
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
}
