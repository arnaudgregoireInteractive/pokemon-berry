import React from 'react';
import Item from '../common/item';
import Draggable from 'react-draggable';
import Money from '../common/money';
import {BERRY_TYPE, ITEM_PRICE} from '../../../../../../shared/enum';

 export default class Buy extends React.Component{

    createItem(k){
        
        return <tr key={k} datakey={k} onClick={this.props.handleItem}>
            <td><Item type={k} quantity={1}/></td>
            <td><Money money={2 * ITEM_PRICE[k]}/></td>
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
            backgroundColor: 'rgba(255, 255, 255, .7)',
            padding: '0px',
            display: 'flex',
            justifyContent: 'center',
            flexFlow: 'column',
            alignItems: 'center'
         };

        if(this.props.visible){
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
                            {Object.keys(BERRY_TYPE).map(this.createItem.bind(this))}
                        </tbody>
                    </table>
                    <button className="nes-btn is-error" style={{width: 'min-content'}} onClick={this.props.hide}>Close</button>
                </div>
            </Draggable> 
        }
        else{
            return null;
        }
    }
 }