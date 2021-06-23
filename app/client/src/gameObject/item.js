import {GameObjects} from 'phaser';
import { ITEM_ACTION } from '../../../shared/enum';

export default class Item extends GameObjects.Container {
  constructor(scene, item) {
    super(scene, -70 + 35 * (item.index % 5), -140 + 35 * Math.floor(item.index / 5));
    let width = 30;
    let height = 30;
    this.setSize(width, height);
    this.id = item.id;
    this.add(new GameObjects.Image(scene, 0 ,0 , 'berries', `${item.type}/thumbnail`));
    if(item.quantity){
        this.add(new GameObjects.Text(scene, 0, 0, item.quantity, {fontFamily: 'Verdana', color: '#000000'}));
    }
    this.initializeInteractive();
    scene.add.existing(this);
  }

  enterButtonHoverState(){

  }

  enterButtonRestState(){

  }

  enterButtonActiveState(){
    document.getElementById('game').dispatchEvent(new CustomEvent('item', {detail: {action: ITEM_ACTION.USE, id: this.id}}));
  }

  initializeInteractive(){
    this.setInteractive({cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`})
    .on('pointerover', () => this.enterButtonHoverState())
    .on('pointerout', () => this.enterButtonRestState())
    .on('pointerdown', () => this.enterButtonActiveState())
    .on('pointerup', () => this.enterButtonHoverState());
    
    this.scene.input.setDraggable(this);

    this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.scene.input.on('drop', function (pointer, gameObject, dropZone) {
        gameObject.x = dropZone.parentContainer.x;
        gameObject.y = dropZone.parentContainer.y;

    });

    this.scene.input.on('dragend', function (pointer, gameObject, dropped) {
        console.log('dragend');
        if (!dropped)
        {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        }
    });
  }
}
