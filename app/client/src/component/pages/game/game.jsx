import React from 'react';
import GameContainer from '../../../game/game-container';
import Chat from './chat/chat';
import Inventory from './inventory/inventory';
import Prompt from './prompt/prompt';
import Sell from './sell/sell';
import { ACTION_TYPE } from '../../../../../shared/enum';

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
      promptVisible: false,
      sellVisible: false
    };
  }

  componentDidMount(){
    document.getElementById('game').addEventListener('cursor', (this.handleCursor.bind(this)));
    document.getElementById('game').addEventListener('start-scenes', (this.startScenes.bind(this)));
  }

  componentWillUnmount(){
    document.getElementById('game').removeEventListener('cursor', this.handleCursor.bind(this));
    document.getElementById('game').addEventListener('start-scenes', (this.startScenes.bind(this)));
  }

  startScenes(){
    this.game.startScenes();
    this.focusGame();
  }

  handleCursor(e){
    this.game.handleCursor(e.detail);
    this.setPromptVisible(false);
  }

  sendMessage(newMessage){
    this.game.sendMessage(newMessage);
  }
  
  handleAction(e){
    e.preventDefault();
    const action = e.target.textContent;
    switch (action) {
        case ACTION_TYPE.HARVEST:
            this.game.handleAction(action);
            break;
    
        default:
            break;
    }

  }

  handleItem(e){
    e.preventDefault();
    this.game.handleItem(e.target.id);
  }

  handleSellItem(e){
      e.preventDefault();
      console.log(e);
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
          handleItem={this.handleItem.bind(this)}
        />
        <Prompt
          prompt={this.state.prompt}
          visible={this.state.promptVisible}
          handleAction={this.handleAction.bind(this)}
        />
        <Sell
          visible={this.state.sellVisible}
          inventory={this.state.inventory}
          handleItem={this.handleSellItem.bind(this)}
        />
      </main>
    );
  }
}
