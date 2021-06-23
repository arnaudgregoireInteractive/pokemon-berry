import {Scene} from 'phaser';
import PlayerManager from '../manager/player-manager';
import {ORIENTATION, KEY_STATUS, ZONES, NPC_ID} from '../../../shared/enum';
import AnimationManager from '../manager/animation-manager';
import BerryManager from '../manager/berry-manager';
export default class GameScene extends Scene {
  constructor() {
    super({
      key: 'game-scene'
    });
  }

  preload() {
    this.load.multiatlas('hero', 'asset/atlas/hero.json', 'asset/atlas/');
    this.load.multiatlas('npcs', 'asset/atlas/npcs.json', 'asset/atlas/');
    this.load.multiatlas('berries', 'asset/atlas/berries.json', 'asset/atlas');
    this.load.image('tileset-building', `asset/tileset/tileset-building.png`);
    this.load.image('tileset-world', `asset/tileset/tileset-world.png`);
    this.load.tilemapTiledJSON(this.zone, `asset/tilemap/${this.zone}.json`);
  }

  create() {
    this.map = this.make.tilemap({key: this.zone});
    console.log(this.zone);
    this.tilesetWorld = this.map.addTilesetImage('tileset-world', 'tileset-world', 16, 16, 1, 1);
    this.tilesetBuilding = this.map.addTilesetImage('tileset-building', 'tileset-building', 16, 16, 1, 1);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.world = this.map.createLayer('world', this.tilesetWorld, 0, 0);
    this.building = this.map.createLayer('buildings', this.tilesetBuilding, 0, 0);
    Object.keys(NPC_ID).forEach(id=>{
      [0,2,4,6].forEach(orientation=>{
        this.map.createFromObjects('npcs',{name:`${id}/${orientation}`, key: 'npcs', frame:`${id}/${orientation}`});
      });
    });

    this.animationManager = new AnimationManager(this);
    this.playerManager = new PlayerManager(this, this.players);
    this.berryManager = new BerryManager(this, this.berries);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.initialize();
  }

  initialize(){
    this.players.forEach(player => {
      this.playerManager.addPlayer(player);
    });
  }

  init(room){
    //console.log(room.state.zone);
    this.zone = room.state.zone;
    this.players = room.state.players;
    this.sessionId = room.sessionId;
    this.berries = room.state.berries;
  }

  update(){
    if (Phaser.Input.Keyboard.JustDown(this.leftKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("cursor", {detail: {key: ORIENTATION.LEFT, input: KEY_STATUS.DOWN}}));
    }
    if (Phaser.Input.Keyboard.JustDown(this.rightKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("cursor", {detail: {key: ORIENTATION.RIGHT, input: KEY_STATUS.DOWN}}));
    }
    if (Phaser.Input.Keyboard.JustDown(this.upKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("cursor", {detail: {key: ORIENTATION.UP, input: KEY_STATUS.DOWN}}));
    }
    if (Phaser.Input.Keyboard.JustDown(this.downKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("cursor", {detail: {key: ORIENTATION.DOWN, input: KEY_STATUS.DOWN}}));
    }
    if (Phaser.Input.Keyboard.JustUp(this.leftKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("cursor", {detail: {key: ORIENTATION.LEFT, input: KEY_STATUS.UP}}));
    }
    if (Phaser.Input.Keyboard.JustUp(this.rightKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("cursor", {detail: {key: ORIENTATION.RIGHT, input: KEY_STATUS.UP}}));
    }
    if (Phaser.Input.Keyboard.JustUp(this.upKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("cursor", {detail: {key: ORIENTATION.UP, input: KEY_STATUS.UP}}));
    }
    if (Phaser.Input.Keyboard.JustUp(this.downKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("cursor", {detail: {key: ORIENTATION.DOWN, input: KEY_STATUS.UP}}));
    }
    if(Phaser.Input.Keyboard.JustDown(this.spaceKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("interaction"));
    }
  }
}
