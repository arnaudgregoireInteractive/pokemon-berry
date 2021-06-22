const schema = require('@colyseus/schema');
const { BERRY_TYPE } = require('../../shared/enum');
const Schema = schema.Schema;
const Item = require('./item');
const StackableItem = require('./stackable-item');

class Inventory extends Schema {
  constructor(capacity) {
    super();
    this.capacity = capacity;
    this.slots = new schema.MapSchema();
    this.addItem(BERRY_TYPE.CHERI_BERRY, true);
    }

    addItem(type, stackable){
        let slot = this.getSlotByType(type);
        if(slot){
            slot.quantity += 1;
        }
        else{
            let index = this.getFirstIndexAvailable();
            let item;
            if(stackable){
                item = new StackableItem(type, index, 1);
            }
            else{
                item = new Item(type, index);
            }
        }
    }

    getFirstIndexAvailable(){
        let index;
        for (let i = 0; i < this.capacity; i++) {
            const slot = this.getSlotByIndex(i);
            if(!slot){
                index = i;
                break;
            }
        }
        return index;
    }

    getSlotByIndex(index){
        let slot;
        this.slots.forEach(slot =>{
            if(s.index == index){
                slot = s;
            }
        });
        return slot;
    }

    getSlotByType(type){
        let slot;
        this.slots.forEach(s =>{
            if(s.stackable && s.type == type){
                slot = s;
            }
        });
        return slot;
    }
}

schema.defineTypes(Inventory, {
  slots : { map: Item }
});

module.exports = Inventory;
