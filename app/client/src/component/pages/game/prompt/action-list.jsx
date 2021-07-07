import React from 'react';

 export default class ActionsList extends React.Component{

    createAction(action){
        return <li key={action}><button className="nes-btn is-primary" onClick={this.props.handleAction}>{action}</button></li>
    }

    render() {
        //console.log(this.props);
        const listStyle = {
            display: 'flex',
            listStyle: 'none',
            padding: '0px'
        };

        if(this.props.actions && Array.isArray(this.props.actions)){
            return <ul style={listStyle}>{this.props.actions.map(this.createAction.bind(this))}</ul>
        }
        else{
            return null;
        }
       
    }
 }