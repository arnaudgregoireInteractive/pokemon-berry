import Player from '../gameObject/player';
import {TILESET_PIXEL} from '../../../shared/enum';

export default class PlayerManager{
    constructor(scene){
        this.scene = scene;
        this.group = this.scene.add.group();
        this.player = undefined;
    }

    addPlayer(player){
        let phaserPlayer = new Player(this.scene, player);
        this.group.add(phaserPlayer);
        this.scene.cameras.main.startFollow(phaserPlayer, true, 0.08, 0.08);
        this.scene.cameras.main.setZoom(5);
    }

    removePlayer(id){
        this.group.getChildren().forEach((player) => {
            if (player.id == id) {
                player.destroy(true);
            }
        });
    }

    handlePlayerChange(player, change){
        this.group.getChildren().forEach((p) =>{
            if(p.id == player.id){
                switch (change.field) {
                    case 'x':
                        p.positionX = change.value;
                        p.moveManager.moveTo(p.positionX * TILESET_PIXEL + TILESET_PIXEL / 2, p.positionY * TILESET_PIXEL + TILESET_PIXEL / 2);
                        break;

                    case 'y':
                        p.positionY = change.value;
                        p.moveManager.moveTo(p.positionX * TILESET_PIXEL + TILESET_PIXEL / 2, p.positionY * TILESET_PIXEL + TILESET_PIXEL / 2);
                        break;

                    case 'orientation':
                        p.orientation = change.value;
                        break;
                
                    default:
                        break;
                }
            }
        });
    }
}