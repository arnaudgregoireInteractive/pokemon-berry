import {GameObjects} from 'phaser';

export default class ItemPlaceHolder extends GameObjects.Container {
  constructor(scene, x, y, index) {
    //console.log(berry.id, berry.x, berry.y, berry.status, berry.dialog, berry.name);
    super(scene, x, y);
    this.index = index;
    let width = 30;
    let height = 30;
    this.setSize(width, height);
    this.add(new GameObjects.Rectangle(scene, 0, 0, width, height, 0xffffff, 0.9));
    this.add(new GameObjects.Zone(scene, 0 ,0 , width, height).setRectangleDropZone(width, height));
    scene.add.existing(this);
  }
}
