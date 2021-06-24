const schema = require('@colyseus/schema');
const { BERRY_TYPE } = require('../../shared/enum');
const Schema = schema.Schema;
const Item = require('./item');
const StackableBerry = require('./stackable-berry');
const StackableItem = require('./stackable-item');

class Inventory extends Schema {
  constructor(capacity) {
    super();
    this.assign({
        capacity: capacity
    });
    this.slots = new schema.MapSchema();
    this.addItem(BERRY_TYPE.CHERI_BERRY, true);
    this.addItem(BERRY_TYPE.CHERI_BERRY, true);
    this.addItem(BERRY_TYPE.CHESTO_BERRY, true);
    this.addItem(BERRY_TYPE.PECHA_BERRY, true);
    }

    removeItem(item){
        if(item.stackable){
            if(item.quantity > 1){
                item.quantity -= 1;
            }
            else{
                this.slots.delete(item.id);
            }
        }
        else{
            this.slots.delete(item.id);
        }
    }

    addItem(type, stackable){
        let slot = this.getSlotByType(type);
        if(slot){
            slot.quantity += 1;
        }
        else{
            let index = this.getFirstAvailableIndex();
            let item;
            if(stackable){
                item = new StackableBerry(type, index, 1);
            }
            else{
                item = new Item(type, index);
            }
            this.slots.set(item.id, item);
        }
    }

    getFirstAvailableIndex(){
        let indexNonAvailable = [];
        let index = 0;
        this.slots.forEach(slot =>{
            indexNonAvailable.push(slot.index);
        });
        for (let i = 0; i < this.capacity; i++) {
            if(!indexNonAvailable.includes(i)){
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
    capacity: 'uint8',
    slots : { map: Item }
});

module.exports = Inventory;
