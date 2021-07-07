import React from 'react';

 export default class Sell extends React.Component{

    createItem(keyValue){
        const k = keyValue[0];
        const v = keyValue[1];
        return <li key={k}><Item type={v.type} quantity={v.quantity} itemId={v.id} handleItem={this.props.handleItem}/></li>;
    }

    render() {
        //console.log(this.props);
        const listStyle = {
            display: 'flex',
            listStyle: 'none',
            padding: '0px'
        };

        if(this.props.visible && this.props.inventory && this.props.inventory.slots){
            return <div><ul style={listStyle}>{Array.from(this.props.inventory.slots).map(this.createItem.bind(this))}</ul></div>;
        }
        else{
            return null;
        }
    }
 }