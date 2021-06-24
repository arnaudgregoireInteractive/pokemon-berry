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
    this.question = undefined;
    this.inventory = undefined;
    this.iKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
  }

  update(){
    if (Phaser.Input.Keyboard.JustDown(this.iKey)){
      document.getElementById('game').dispatchEvent(new CustomEvent("inventory"));
    }
  }

  renderDialog(nickName, speech, actions){
    if(this.dialog || this.question){
      this.clearDialog();
      this.clearQuestion();
    }
    else{
      let message;
      if(nickName != ''){
        message = `${nickName} : ${speech}`;
      }
      else{
        message = speech;
      }
      this.dialog = DialogGenerator.createTextBox(this, this.cameras.main.centerX -200, this.cameras.main.centerY + 100, actions)
      .start(message, 20);
    }
  }

  clearUI(){
    this.clearQuestion();
    this.clearDialog();
  }

  clearQuestion(){
    if(this.question){
      this.question.destroy();
      this.question = undefined;
    }
  }

  clearDialog(){
    if(this.dialog){
      this.dialog.destroy();
      this.dialog = undefined;
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
