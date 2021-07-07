import React from 'react';
import ActionsList from './action-list';

 export default class Prompt extends React.Component{

    render() {
        //console.log(this.props);
        const promptStyle = {
            top:'40%',
            right:'40%',
            maxWidth: '400px',
            width: '400px',
            maxHeight: '200px',
            height: '200px',
            backgroundColor: 'rgba(255, 255, 255, .7)',
            padding: '0px',
            position: 'absolute',
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center'
        };

        const pStyle={
            textAlign: 'center'
        }

        if(this.props.prompt.title !== undefined && this.props.visible){
            return <div className= "nes-container is-rounded" style={promptStyle}>
                <p style={pStyle}>{this.props.prompt.title}</p>
                <p style={pStyle}>{this.props.prompt.info}</p>
                <ActionsList actions={this.props.prompt.actions} handleAction={this.props.handleAction}/>
            </div>
        }
        else{
            return null;
        }
       
    }
 }