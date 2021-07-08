import { Game } from 'phaser';
import GameScene from '../scene/game-scene';
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import LoadingScene from '../scene/loading-scene';


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
      firebase.auth().currentUser.getIdToken().then(token =>{
        fetch(`${window.location.protocol}//${window.location.host}/zone?id=${firebase.auth().currentUser.uid}`)
        .then((rep)=> {
          return rep.json();
        })
        .then((json)=> {
          window._client.joinOrCreate(json.zone, {idToken: token}).then(room=>{
            this.room = room;
            this.initializeEvents();
            this.room.onStateChange.once((state) =>{
              this.game = new Game({
                type: Phaser.CANVAS,
                mode: Phaser.Scale.FIT,
                width: 1800,
                height: 900,
                parent: this.container.current,
                scene: [LoadingScene, GameScene],
                pixelArt: true,
                plugins: {
                  global: [{
                    key: 'rexMoveTo',
                    plugin: MoveToPlugin,
                    start: true
                  }]
                }
              });
            })
          })
        })
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

      this.room.state.messages.onAdd = this.component.appendMessage.bind(this.component);
      
      this.room.onMessage("link", (message) => {
        this.handleLink(message);
      });
      this.room.onMessage("prompt", (message) => {
        this.component.setPrompt(message);
      });
    }
  }
  
  startScenes(){
    this.game.scene.start('game-scene', this.room);
    //this.game.scene.start('ui-scene');
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
    if (player.id == firebase.auth().currentUser.uid) {
      this.player = player;
      this.component.setMoney(this.player.money);
      this.player.inventory.slots.onAdd = (item) => this.onInventoryAdd(item);
      this.player.inventory.slots.onRemove = (item, key) => this.component.setInventory(this.player.inventory);
    }
    player.onChange = ((changes) => {
      changes.forEach((change) => this.handlePlayerChange(change, player));
    });

    this.handlePlayerAdd(player);
  }

  onInventoryAdd(item){
    
    item.onChange = ()=>{
      this.component.setInventory(this.player.inventory);
    };
    this.component.setInventory(this.player.inventory);
  }

  onPlayerRemove(player, key){
    if(this.game && this.game.scene && this.game.scene.getScene('ui-scene') && this.game.scene.getScene('game-scene').playerManager){
      this.game.scene.getScene('game-scene').playerManager.removePlayer(key);
    }
  }

  handlePlayerChange(change, player){
    //console.log(change);
    if(this.player && this.player.id == player.id && change.field == 'money'){
      this.component.setMoney(change.value);
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

  handleCursor(message){
    this.room.send('cursor', message);
  }

  handleInteractionInput(){
    this.room.send('interaction');
  }

  handleAction(action){
    this.room.send('action',{type:action});
  }

  handleItem(id){
    this.room.send('item-use', {'id': id});
  }

  handleSellItem(id){
    this.room.send('item-sell', {'id': id});
  }

  sendMessage(message){
    this.room.send('message', {payload : message});
  }

  handleLink(message){
    //console.log('handle link', message.to);
    this.room.removeAllListeners();
    this.room.leave();
    firebase.auth().currentUser.getIdToken().then(token =>{
      window._client.joinOrCreate(message.to, {from: message.from, idToken: token}).then(room=>{
      this.room = room;
      this.initializeEvents();
      this.room.onStateChange.once((state) =>{
        this.game.scene.getScene('game-scene').scene.restart(room);
      });
    });
  });
  } catch (e) {
    console.error("join error", e);
    alert("error");
  }
}
