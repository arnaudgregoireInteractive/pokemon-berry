import React from 'react';

 export default class Money extends React.Component{

    render() {
        const divStyle = {
            display:'flex',
            marginLeft:'10px'
        };

        const imgStyle = {
            width:'24px',
            height:'24px'
        }
        
        return <div style={divStyle}>
             <p>{this.props.money}</p> <img style={imgStyle} src="asset/ui/money.png"/>
        </div>;
     }
 }