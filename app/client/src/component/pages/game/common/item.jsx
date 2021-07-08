import React from 'react';

 export default class Item extends React.Component{

    render() {
        const imgSrc = `asset/image/${this.props.type}.png`;
        const itemStyle = {
            display: 'flex'
        };
        const imgStyle = {
            width:'24px',
            height:'24px',
            marginRight: '5px'
        }

        const quantity = this.props.quantity ? `${this.props.quantity}x` : ``;
        

        return <div style={itemStyle}>
            <img style={imgStyle} src={imgSrc}/>
            <p className="nes-pointer">{quantity} {this.props.type}</p>
        </div>;
     }
 }