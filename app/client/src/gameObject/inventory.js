import {GameObjects} from 'phaser';
import Item from './item';
import ItemPlaceHolder from './item-place-holder';

export default class Inventory extends GameObjects.Container {
  constructor(scene, inventory) {
        super(scene, 1600, 300);
        let width = 200;
        let height = 400;
        this.setSize(width, height);
        this.items = new Map();
        this.inventory = inventory;
        let rectangle = new GameObjects.Rectangle(scene, 0, 0, width, height, 0xffffff, 0.7);
        rectangle.setStrokeStyle(1,0x000000);
        this.add(rectangle);
        this.add(new GameObjects.Text(scene, -40, -190, 'Inventory',{fontFamily: 'Verdana', color: '#000000'}));

        for (let i = 0; i < inventory.capacity; i++) {
            this.add(new ItemPlaceHolder(scene,-70 + 35 * (i % 5),-140 + 35 * Math.floor(i / 5), i));
        }
        this.initializeInteractive();
        this.buildItems();
        scene.add.existing(this);
    }

    initializeInteractive(){
        this.setInteractive();
        this.scene.input.setDraggable(this);
        this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    }

    buildItems(){
        this.inventory.slots.forEach(item => {
            let phaserItem = new Item(this.scene, item);
            this.items.set(phaserItem.id, phaserItem);
            this.add(phaserItem);
        })
    }

  
     handleInventoryChange(change, item){

    }

    addItem(item){

    }

    removeItem(key){
        let item = this.items.get(key);
        if(item){
            item.destroy(true);
        }
        this.items.delete(key);
    }
}
