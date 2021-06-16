import React from 'react';
import GameContainer from '../game/game-container';
import Chat from './chat/chat';

export default class App extends React.Component {
  constructor() {
    super();
    this.container = React.createRef();
    this.game = new GameContainer(this);
  }

  componentDidMount(){
    document.getElementById('game').addEventListener('cursor', (this.handlePlayerInput.bind(this)));
  }

  componentWillUnmount(){
    document.getElementById('game').removeEventListener('cursor', this.handlePlayerInput.bind(this));
  }

  handlePlayerInput(e){
    this.game.handlePlayerInput(e.detail);
  }

  sendMessage(newMessage){
    this.game.sendMessage(newMessage);
  }
  
  handleSubmit (e) {
    e.preventDefault()
    this.game.sendMessage(this.refs.chat.state.currentText);
    this.refs.chat.setState({currentText: ""});
  }

  receiveMessage (message) {
    this.setState({messages :this.state.messages.concat({name: message.name, payload: message.payload})});
  }

  render() {
    return (
      <div>
        <main style={{display:'flex'}}>
          <div id="game" ref={this.container}></div>
          <Chat ref="chat" receiveMessage={this.receiveMessage} handleSubmit={this.handleSubmit.bind(this)}/>
        </main>
      </div>
    );
  }
}
