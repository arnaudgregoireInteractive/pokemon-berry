import React from 'react';
import GameContainer from '../../../game/game-container';
import Chat from './chat/chat';

export default class Game extends React.Component {
  constructor() {
    super();
    this.container = React.createRef();
    this.game = new GameContainer(this);
  }

  componentDidMount(){
    document.getElementById('game').addEventListener('cursor', (this.handlePlayerInput.bind(this)));
    document.getElementById('game').addEventListener('interaction', (this.handleInteractionInput.bind(this)));
    document.getElementById('game').addEventListener('inventory', (this.showInventory.bind(this)));
    document.getElementById('game').addEventListener('item', (this.handleItemInteraction.bind(this)));
    document.getElementById('game').addEventListener('move-item', (this.handleItemMove.bind(this)));
    document.getElementById('game').addEventListener('action', (this.handleAction.bind(this)));
  }

  componentWillUnmount(){
    document.getElementById('game').removeEventListener('cursor', this.handlePlayerInput.bind(this));
    document.getElementById('game').addEventListener('interaction', (this.handleInteractionInput.bind(this)));
    document.getElementById('game').addEventListener('inventory', (this.showInventory.bind(this)));
    document.getElementById('game').addEventListener('item', (this.handleItemInteraction.bind(this)));
    document.getElementById('game').addEventListener('move-item', (this.handleItemMove.bind(this)));
    document.getElementById('game').addEventListener('action', (this.handleAction.bind(this)));
  }

  handlePlayerInput(e){
    this.game.handlePlayerInput(e.detail);
  }

  handleItemMove(e){
    this.game.handleItemMove(e.detail);
  }

  showInventory(){
    this.game.showInventory();
  }

  handleItemInteraction(e){
    this.game.handleItemInteraction(e.detail);
  }

  handleAction(e){
    this.game.handleAction(e.detail);
  }

  handleInteractionInput(e){
    this.game.handleInteractionInput();
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
