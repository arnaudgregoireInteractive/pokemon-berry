import React from 'react';
import Item from '../common/item';
import Draggable from 'react-draggable';
import Money from '../common/money';

 export default class Sell extends React.Component{

    createItem(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        
        return <tr>
            <td><Item type={v.type} quantity={v.quantity} itemId={v.id} handleItem={this.props.handleItem}/></td>
            <td><Money money={v.price}/></td>
        </tr>
    }

    render() {
        //console.log(this.props);
        const tableStyle = {
            backgroundColor: 'rgba(255, 255, 255, .7)'
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
                    <table style={tableStyle} className="nes-table is-bordered is-centered">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from(this.props.inventory.slots).map(this.createItem.bind(this))}
                        </tbody>
                    </table>
                </div>
            </Draggable> 
        }
        else{
            return null;
        }
    }
 }