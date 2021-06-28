import {CANVAS, Scene} from 'phaser';
import { ZONES } from '../../../shared/enum';

export default class LoadingScene extends Scene {
  constructor() {
    super({
      key: 'loading-scene',
      type: CANVAS
    });
  }

  preload(){
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    progressBox.fillRect(100, height/4, width-200, 50);
    

    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
    
    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    assetText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(100, height/4, (width-200) * value, 30);
    });
    
    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });

    this.load.multiatlas('hero', 'asset/atlas/hero.json', 'asset/atlas/');
    this.load.multiatlas('npcs', 'asset/atlas/npcs.json', 'asset/atlas/');
    this.load.multiatlas('berries', 'asset/atlas/berries.json', 'asset/atlas');
    this.load.image('tileset-building', `asset/tileset/tileset-building.png`);
    this.load.image('tileset-world', `asset/tileset/tileset-world.png`);
    this.load.image('nextPage', 'asset/ui/arrow-down-left.png');
    this.load.image('money', 'asset/ui/money.png');
    this.load.bitmapFont('atari', 'asset/font/atari-classic.png', 'asset/font/atari-classic.xml');
    Object.keys(ZONES).forEach(zone => {
        this.load.tilemapTiledJSON(zone, `asset/tilemap/${zone}.json`);
    });
  }

  create() {
    document.getElementById('game').dispatchEvent(new CustomEvent('start-scenes'));
  }

  update(){
  }

}
