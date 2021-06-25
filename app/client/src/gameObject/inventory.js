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
        let rectangle = new GameObjects.Rectangle(scene, 0, 0, width, height, 0xffffff, 0.7);
        rectangle.setStrokeStyle(1,0x000000);
        this.add(rectangle);
        this.add(new GameObjects.Text(scene, -40, -190, 'Inventory',{fontFamily: 'Verdana', color: '#000000'}));

        for (let i = 0; i < inventory.capacity; i++) {
            this.add(new ItemPlaceHolder(scene,-70 + 35 * (i % 5),-140 + 35 * Math.floor(i / 5), i));
        }
        this.buildItems(inventory);
        scene.add.existing(this);
    }

    buildItems(inventory){
        inventory.slots.forEach(item => {
            this.addItem(item);
        });
    }
  
     handleInventoryChange(change, item){
        let phaserItem = this.items.get(item.id);
        if(phaserItem){
            switch (change.field) {
                case 'quantity':
                    phaserItem.quantity.setText(change.value);
                    break;
            
                case 'index':
                    phaserItem.index = change.value;
                    phaserItem.x = -70 + 35 * (phaserItem.index % 5);
                    phaserItem.y = -140 + 35 * Math.floor(phaserItem.index / 5);

                default:
                    break;
            }
        }
    }

    addItem(item){
        if(!this.items.get(item.id)){
            let phaserItem = new Item(this.scene, item);
            this.items.set(phaserItem.id, phaserItem);
            this.add(phaserItem);
        }
    }

    removeItem(key){
        let item = this.items.get(key);
        if(item){
            item.destroy();
        }
        this.items.delete(key);
    }
}
