import {Scene} from 'phaser';
import Inventory from '../gameObject/inventory';
import DialogGenerator from '../generator/dialog-generator';

export default class UIScene extends Scene {
  constructor() {
    super({
      key: 'ui-scene'
    });
  }

  preload(){
    this.load.image('nextPage', 'asset/ui/arrow-down-left.png');
  }

  create() {
    this.dialog = undefined;
    this.inventory = undefined;
    this.iKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
  }

  update(){
    if (Phaser.Input.Keyboard.JustDown(this.iKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("inventory"));
    }
  }

  renderDialog(nickName, speech){
    if(this.dialog !== undefined){
        this.dialog.destroy();
        this.dialog = undefined;
    }
    else{
        this.dialog = DialogGenerator.createTextBox(this, 450, 500, {
            wrapWidth: 800,
        })
        .start(`${nickName} : ${speech}`, 20);
    }
  }

  addItem(item){
    if(this.inventory){
        this.inventory.addItem(item);
    }
  }

  removeItem(key){
    if(this.inventory){
      this.inventory.removeItem(key);
    }
  }

  handleInventoryChange(change, item){
    if(this.inventory){
      this.inventory.handleInventoryChange(change, item);
    }
  }
  
  renderInventory(inventory){
    if(this.inventory !== undefined){
      this.inventory.destroy();
      this.inventory = undefined;
    }
    else{
      this.inventory = new Inventory(this, inventory);
    }
  }
}
