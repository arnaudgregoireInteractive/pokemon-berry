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
        const price = this.props.price ? <div style={{display:'flex', marginLeft:'10px'}}> <p>{this.props.price}</p> <img style={imgStyle} src="asset/ui/money.png"/></div>: <div></div>;

        return <div style={itemStyle}>
            <img style={imgStyle} src={imgSrc}/>
            <p id={this.props.itemId} onClick={this.props.handleItem} className="nes-pointer">{quantity} {this.props.type}</p>
            {price}
        </div>;
     }
 }