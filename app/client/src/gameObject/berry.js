import {GameObjects} from 'phaser';
import { TILESET_PIXEL, BERRY_STATUS } from '../../../shared/enum';

export default class Berry extends GameObjects.Container {
  constructor(scene, berry) {
    //console.log(berry.id, berry.x, berry.y, berry.status, berry.dialog, berry.name);
    super(scene, berry.x * TILESET_PIXEL +TILESET_PIXEL/2, berry.y * TILESET_PIXEL - 6);
    this.id = berry.id;
    this.positionX = berry.x;
    this.positionY = berry.y;
    this.status = berry.status;
    this.name = berry.name;
    this.type = berry.type;
    this.step = berry.step;
    this.ownerId = berry.ownerId;

    this.sprite = new GameObjects.Sprite(scene,0,0,'berries', `${this.type}/${this.status}/0`);
    this.scene.add.existing(this.sprite);
    this.add(this.sprite);
    scene.add.existing(this);
  }
}
