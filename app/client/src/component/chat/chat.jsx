import React from 'react';
import ChatHistory from './chat-history';
import Draggable from 'react-draggable';
import "nes.css/css/nes.min.css";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        currentText: "",
        messages : []
    };

    this.handleSubmit = props.handleSubmit;
    this.receiveMessage = props.receiveMessage.bind(this);
  }

  onInputChange (e) {
    e.preventDefault();
    this.setState({ currentText: e.target.value });
  }


  render() {
    var windowStyles = {
      position:'absolute',
      bottom:'20px',
      left:'20px',
      maxWidth: '600px',
      width: '600px',
      maxHeight: '200px',
      height: '200px',
      margin: '5px',
      backgroundColor: 'rgba(255, 255, 128, .5)',
      border: '1px solid #000000'
   };
   

   var formStyles = {
      display: 'flex',
      width: '100%',
      position: 'absolute',
      bottom: '-50px',
      left: '0px'
   };
   
    return(
      <Draggable>
        <div style={windowStyles}>
            <ChatHistory messages={this.state.messages} />
            <form style={formStyles} onSubmit={this.handleSubmit}>
              <div className="nes-field" style={{width: '80%'}}>
                <input id="name_field" type="text" className="nes-input"  onChange={this.onInputChange.bind(this)} value={this.state.currentText} />
              </div>
              
              <button className="nes-btn is-primary" style={{width: '20%'}}>Send</button>
            </form>
        </div>
      </Draggable>
    );
  }
}