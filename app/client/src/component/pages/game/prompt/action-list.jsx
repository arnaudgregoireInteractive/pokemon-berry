import React from 'react';

 export default class ActionsList extends React.Component{

    createAction(action){
        return <button className="nes-btn is-primary">{action}</button>
    }

    render() {
        //console.log(this.props);
        const listStyle = {
            display: 'flex'
        };

        if(this.props.actions && Array.isArray(this.props.actions)){
            return <ul style={listStyle}>{this.props.actions.map(this.createAction.bind(this))}</ul>
        }
        else{
            return null;
        }
       
    }
 }