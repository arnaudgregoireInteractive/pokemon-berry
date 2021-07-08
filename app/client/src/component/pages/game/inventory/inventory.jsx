import React from 'react';
import Item from '../common/item';
import Draggable from 'react-draggable';
import Money from '../common/money';

 export default class Inventory extends React.Component{

    createItem(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        return <li key={k} datakey={k} onClick={this.props.handleItem}><Item type={v.type} quantity={v.quantity}/></li>;
    }

    render() {
        const inventoryStyle = {
            position:'absolute',
            top:'20px',
            right:'20px',
            width: '270px',
            height: '400px',
            backgroundColor: 'rgba(255, 255, 255, .7)',
            padding: '0px'
         };

        const ulStyle = {
            listStyle: 'none',
            padding: '0px'
        };

        const headStyle = {
            display: 'flex',
            justifyContent: 'space-around'
        };
         
        //console.log(this.props.inventory.slots);
        if(this.props.inventory.slots && this.props.visible){
            return <Draggable>
                <div className= "nes-container is-rounded" style={inventoryStyle}>
                    <div style={headStyle}><p>Inventory</p> <Money money={this.props.money}/></div>
                    <ul style={ulStyle}>{Array.from(this.props.inventory.slots).map(this.createItem.bind(this))}</ul>
                </div>
            </Draggable>;
        }
        else{
            return null;
        }
    }
 }