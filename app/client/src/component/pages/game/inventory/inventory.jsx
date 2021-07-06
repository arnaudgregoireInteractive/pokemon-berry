import React from 'react';
import Item from './item';
import Draggable from 'react-draggable';

 export default class Inventory extends React.Component{

    createItem(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        return <li key={k}><Item type={v.type} quantity={v.quantity} itemId={v.id} handleItemInput={this.props.handleItemInput}/></li>;
    }

    render() {
        const inventoryStyle = {
            position:'absolute',
            top:'20px',
            right:'20px',
            maxWidth: '270px',
            width: '270px',
            maxHeight: '400px',
            height: '400px',
            backgroundColor: 'rgba(255, 255, 255, .6)',
            padding: '0px'
         };

        const ulStyle = {
            listStyle: 'none',
            padding: '0px'
        }
         
        //console.log(this.props.inventory.slots);
        if(this.props.inventory.slots && this.props.visible){
            return <Draggable>
                <div className= "nes-container is-rounded" style={inventoryStyle}>
                    <p>Inventory</p>
                    <ul style={ulStyle}>{Array.from(this.props.inventory.slots).map(this.createItem.bind(this))}</ul>
                </div>
            </Draggable>;
        }
        else{
            return null;
        }
    }
 }