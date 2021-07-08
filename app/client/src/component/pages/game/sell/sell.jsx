import React from 'react';
import Item from '../common/item';
import Draggable from 'react-draggable';
import Money from '../common/money';

 export default class Sell extends React.Component{

    createItem(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        
        return <tr key={v.id} datakey={v.id} onClick={this.props.handleItem}>
            <td><Item type={v.type} quantity={v.quantity}/></td>
            <td><Money money={v.price}/></td>
        </tr>
    }

    render() {
        //console.log(this.props);
        const tableStyle = {
            backgroundColor: 'rgba(255, 255, 255, .7)',
            marginBottom: '10px'
        };

        const sellStyle = {
            position: 'absolute',
            top:'50%',
            left:'50%',
            marginTop:'-100px',
            marginLeft:'-200px',
            width: '400px',
            height: '200px',
            backgroundColor: 'rgba(255, 255, 255, .7)',
            padding: '0px',
            display: 'flex',
            justifyContent: 'center',
            flexFlow: 'column',
            alignItems: 'center'
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
                    <button className="nes-btn is-error" style={{width: 'min-content'}} onClick={this.props.hideSell}>Close</button>
                </div>
            </Draggable> 
        }
        else{
            return null;
        }
    }
 }