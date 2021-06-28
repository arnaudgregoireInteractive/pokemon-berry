import Player from '../gameObject/player';
import {TILESET_PIXEL, STATUS} from '../../../shared/enum';

export default class PlayerManager{
    constructor(scene, players){
        this.scene = scene;
        this.group = this.scene.add.group();
        this.player = undefined;
        this.buildPlayers(players);
    }

    buildPlayers(players){
        players.forEach(player =>{
            this.addPlayer(player);
        });
    }

    addPlayer(player){
        if(this.group && this.group.children && !this.isPlayer(player.id)){
            let phaserPlayer = new Player(this.scene, player);
            this.group.add(phaserPlayer);
            if(player.id == this.scene.uid){
                this.player = phaserPlayer;         
                this.scene.cameras.main.startFollow(phaserPlayer, true, 0.08, 0.08);
                this.scene.cameras.main.setZoom(5);
            }
        }
    }

    isPlayer(id){
        let isPlayer = false;
        this.group.getChildren().forEach((player) => {
            if (player.id == id) {
                isPlayer = true;
            }
        });
        return isPlayer;
    }

    removePlayer(id){
        this.group.getChildren().forEach((player) => {
            if (player.id == id) {
                player.destroy(true);
            }
        });
    }

    handlePlayerChange(player, change){
        if(this.group && this.group.children){
            this.group.getChildren().forEach((p) =>{
                if(p.id == player.id){
                    switch (change.field) {
                        case 'x':
                            p.positionX = change.value;
                            p.moveManager.moveTo(p.positionX * TILESET_PIXEL + TILESET_PIXEL / 2, p.positionY * TILESET_PIXEL + TILESET_PIXEL / 2 -2);
                            break;
    
                        case 'y':
                            p.positionY = change.value;
                            p.moveManager.moveTo(p.positionX * TILESET_PIXEL + TILESET_PIXEL / 2, p.positionY * TILESET_PIXEL + TILESET_PIXEL / 2 -2);
                            break;
    
                        case 'orientation':
                            p.orientation = change.value;
                            this.scene.animationManager.animate(p);
                            break;
                    
                        case 'status':
                            p.status = change.value;
                            this.scene.animationManager.animate(p);
                            break;
    
                        default:
                            break;
                    }
                }
            });
        }
    }
}