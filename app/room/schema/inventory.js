const schema = require('@colyseus/schema');
const { BERRY_TYPE } = require('../../shared/enum');
const Schema = schema.Schema;
const Item = require('./item');
const StackableBerry = require('./stackable-berry');
const uniqid = require('uniqid');

class Inventory extends Schema {
  constructor(capacity, items) {
    super();
    this.assign({
        capacity: capacity
    });
    this.slots = new schema.MapSchema();

    if(items){
        items.forEach(item =>{
            if(item.quantity){
                let b = new StackableBerry(item.id, item.type, item.quantity);
                this.slots.set(b.id, b);
            }
        });
    }
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
            let item;
            if(stackable){
                item = new StackableBerry(uniqid('berryStack-'), type, 1);
            }
            else{
                item = new Item(uniqid('item-'),type);
            }
            this.slots.set(item.id, item);
        }
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

    save(){
        let slots = [];
        this.slots.forEach(slot=>{
            slots.push(
                {
                    id: slot.id,
                    type: slot.type,
                    quantity: slot.quantity
            });
        });
        return slots;
    }
}

schema.defineTypes(Inventory, {
    capacity: 'uint8',
    slots : { map: Item }
});

module.exports = Inventory;
