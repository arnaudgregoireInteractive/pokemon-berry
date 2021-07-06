import React from 'react';
import GameContainer from '../../../game/game-container';
import Chat from './chat/chat';
import Inventory from './inventory/inventory';
import Prompt from './prompt/prompt';

export default class Game extends React.Component {
  constructor() {
    super();
    this.container = React.createRef();
    this.game = new GameContainer(this);

    this.state = {
      currentText: "",
      messages : [],
      inventory: {},
      inventoryVisible: true,
      prompt:{},
      promptVisible: false
    };
  }

  componentDidMount(){
    document.getElementById('game').addEventListener('cursor', (this.handlePlayerInput.bind(this)));
    document.getElementById('game').addEventListener('start-scenes', (this.startScenes.bind(this)));
  }

  componentWillUnmount(){
    document.getElementById('game').removeEventListener('cursor', this.handlePlayerInput.bind(this));
    document.getElementById('game').addEventListener('start-scenes', (this.startScenes.bind(this)));
  }

  startScenes(){
    this.game.startScenes();
    this.focusGame();
  }

  handlePlayerInput(e){
    this.game.handlePlayerInput(e.detail);
    this.setPromptVisible(false);
  }

  sendMessage(newMessage){
    this.game.sendMessage(newMessage);
  }
  
  handleItemInput(e){
    e.preventDefault();
    this.game.handleItemInput(e.target.id);
  }

  handleSubmit (e) {
    e.preventDefault()
    this.game.sendMessage(this.state.currentText);
    this.setState({currentText: ""});
  }

  setCurrentText (e) {
    e.preventDefault();
    this.setState({ currentText: e.target.value });
  }

  appendMessage (message) {
    this.setState({messages :this.state.messages.concat({name: message.name, payload: message.payload})});
  }

  setInventory(i){
    this.setState({inventory: i});
  }

  setPrompt(p){
    this.setState((state, props) =>{
        return {
            prompt: p,
            promptVisible: !state.promptVisible
        };
      });
  }

  setPromptVisible(visible){
      this.setState({promptVisible: visible});
  }

  handleKeyPress(e){
    switch (e.code) {
      case "Space":
        this.game.handleInteractionInput();
        break;
    
      case "KeyI":
        this.setState((state, props) =>{
          return {
            inventoryVisible: !state.inventoryVisible
          };
        });
        break;

      default:
        break;
    }
  }

  focusGame() {
    this.container.current.focus();  
  }

  render() {
    return (
      <main style={{display:'flex'}}>
        <div id="game" tabIndex="0" ref={this.container} onClick={this.focusGame.bind(this)} onKeyPress={this.handleKeyPress.bind(this)}></div>
        <Chat
          handleSubmit={this.handleSubmit.bind(this)} 
          setCurrentText={this.setCurrentText.bind(this)}
          currentText={this.state.currentText}
          messages={this.state.messages}
        />
        <Inventory
          inventory={this.state.inventory}
          visible={this.state.inventoryVisible}
          handleItemInput={this.handleItemInput.bind(this)}
        />
        <Prompt
          prompt={this.state.prompt}
          visible={this.state.promptVisible}
        />

      </main>
    );
  }
}
