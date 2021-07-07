import React from 'react';
import Item from '../inventory/item';
import Draggable from 'react-draggable';

 export default class Sell extends React.Component{

    createItem(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        return <li key={k}><Item price={100} type={v.type} quantity={v.quantity} itemId={v.id} handleItem={this.props.handleItem}/></li>;
    }

    render() {
        //console.log(this.props);
        const listStyle = {
            display: 'flex',
            listStyle: 'none',
            padding: '0px'
        };

        const sellStyle = {
            position:'absolute',
            top:'20px',
            left:'20px',
            backgroundColor: 'rgba(255, 255, 255, .7)',
            padding: '0px'
         };

        if(this.props.visible && this.props.inventory && this.props.inventory.slots){
            return <Draggable>
                <div className="nes-container is-rounded" style={sellStyle}>
                    <ul style={listStyle}>{Array.from(this.props.inventory.slots).map(this.createItem.bind(this))}</ul>
                </div>
            </Draggable> 
        }
        else{
            return null;
        }
    }
 }