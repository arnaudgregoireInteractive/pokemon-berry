import React from 'react';
import GameContainer from '../../../game/game-container';
import Chat from './chat/chat';
import Inventory from './inventory/inventory';
import Prompt from './prompt/prompt';
import Sell from './sell/sell';
import Buy from './buy/buy';
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
      prompt:{},
      money:0,
      inventoryVisible: true,
      promptVisible: false,
      sellVisible: false,
      buyVisible: false
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
    this.setState({
      promptVisible:false,
      sellVisible: false,
      buyVisible: false
    });
  }

  sendMessage(newMessage){
    this.game.sendMessage(newMessage);
  }
  
  handleAction(e){
    e.preventDefault();
    const action = e.target.textContent;
    this.setState({promptVisible: false});
    switch (action) {
        case ACTION_TYPE.HARVEST:
          this.game.handleAction(action);
          break;
    
        case ACTION_TYPE.SELL:
          this.setState({sellVisible: true});
          break;

        case ACTION_TYPE.BUY:
          this.setState({buyVisible: true});
          break;
            
        default:
            break;
    }

  }

  handleItem(e){
    e.preventDefault();
    this.game.handleItem(e.currentTarget.attributes.datakey.value);
  }

  handleSellItem(e){
    e.preventDefault();
    this.game.handleSellItem(e.currentTarget.attributes.datakey.value);
  }

  handleBuyItem(e){
    e.preventDefault();
    this.game.handleBuyItem(e.currentTarget.attributes.datakey.value);
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

  setMoney(m){
    this.setState({money: m});
  }

  setPrompt(p){
    this.setState((state, props) =>{
        return {
            prompt: p,
            promptVisible: !state.promptVisible
        };
      });
  }

  hideSell(){
    this.setState({
      sellVisible: false
    });
  }

  hideBuy(){
    this.setState({
      buyVisible: false
    });
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
          money={this.state.money}
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
          hide={this.hideSell.bind(this)}
          handleItem={this.handleSellItem.bind(this)}
        />
        <Buy
          visible={this.state.buyVisible}
          hide={this.hideBuy.bind(this)}
          handleItem={this.handleBuyItem.bind(this)}
        />
      </main>
    );
  }
}
