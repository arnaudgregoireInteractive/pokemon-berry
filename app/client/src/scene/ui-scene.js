import {Scene} from 'phaser';
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

}
