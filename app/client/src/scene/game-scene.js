import {Scene, GameObjects} from 'phaser';
import PlayerManager from '../manager/player-manager';
import {ORIENTATION} from '../../../shared/enum';
import AnimationManager from '../manager/animation-manager';

export default class GameScene extends Scene {
  constructor() {
    super({
      key: 'game-scene'
    });
  }

  preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(500, 500, 1020, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: (height / 2) - 50,
      text: 'Loading...',
      style: {
        font: '30px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: (height / 2) + 10,
      text: '0%',
      style: {
        font: '28px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: (height / 2) + 70,
      text: '',
      style: {
        font: '28px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(500, 510, 1000 * value, 30);
    });

    this.load.on('fileprogress', (file) => {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.multiatlas('hero', 'asset/atlas/hero.json', 'asset/atlas/');
    this.load.image('tileset-building', `asset/tileset/tileset-building.png`);
    this.load.image('tileset-world', `asset/tileset/tileset-world.png`);
    this.load.tilemapTiledJSON('map', `asset/tilemap/PALLET_TOWN.json`);
  }

  create() {
    this.map = this.make.tilemap({key: 'map'});  
    const tilesetWorld = this.map.addTilesetImage('tileset-world', 'tileset-world', 16, 16, 1, 1);
    const tilesetBuilding = this.map.addTilesetImage('tileset-building', 'tileset-building', 16, 16, 1, 1);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.disableInput = false;

    this.map.createLayer('world', tilesetWorld, 0, 0);
    this.map.createLayer('buildings', tilesetBuilding, 0, 0);

    this.animationManager = new AnimationManager(this);
    this.playerManager = new PlayerManager(this);
    this.initialize();
  }

  initialize(){
    this.players.forEach(player => {
      this.playerManager.addPlayer(player);
    });
  }

  init(state){
    this.zone = state.zone;
    this.players = state.players;
  }

  update(){
    if(!this.disableInput){
      if (this.cursors.left.isDown)
      {
        document.getElementById('game').dispatchEvent(new CustomEvent("move", {detail: {direction: ORIENTATION.LEFT}}));
      }
      else if (this.cursors.right.isDown)
      {
        document.getElementById('game').dispatchEvent(new CustomEvent("move", {detail: {direction: ORIENTATION.RIGHT}}));
      }
      else if (this.cursors.up.isDown)
      {
        document.getElementById('game').dispatchEvent(new CustomEvent("move", {detail: {direction: ORIENTATION.UP}}));
      }
      else if (this.cursors.down.isDown)
      {
        document.getElementById('game').dispatchEvent(new CustomEvent("move", {detail: {direction: ORIENTATION.DOWN}}));
      }
    }
  }
}
