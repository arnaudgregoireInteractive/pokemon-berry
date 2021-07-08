import React from 'react';

 export default class Money extends React.Component{

    render() {
        const divStyle = {
            display:'flex',
            marginLeft:'10px'
        };
        
        return <div style={divStyle}>
             <p>{this.props.money}</p> <img src="asset/ui/money.png"/>
        </div>;
     }
 }