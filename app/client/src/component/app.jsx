import React from 'react';
import GameContainer from '../game/game-container';
import { Widget, addResponseMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

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

  receiveMessage(newMessage){
    console.log(newMessage);
    addResponseMessage(newMessage);
  }

  render() {
    return (
      <div>
        <main>
          <div id="game" ref={this.container}></div>
          <div id="chat" className="App">
            <Widget 
            handleNewUserMessage={this.sendMessage.bind(this)}
            />
          </div>
        </main>
      </div>
    );
  }
}
