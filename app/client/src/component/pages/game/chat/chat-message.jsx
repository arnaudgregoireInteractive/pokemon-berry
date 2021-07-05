import React from 'react';

 export default class ChatMessage extends React.Component{
    render() {
        return(
           <p style={{marginBottom: 0}}>{this.props.message.name} - {this.props.message.payload} <br/></p>
        );
     }
 }