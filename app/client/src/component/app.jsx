import React from 'react';
import GameContainer from '../game/game-container';

export default class App extends React.Component {
  constructor() {
    super();
    this.container = React.createRef();
    this.game = new GameContainer(this.container);
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

  render() {
    return (
      <div>
        <main>
          <div id="game" ref={this.container}></div>
        </main>
      </div>
    );
  }
}
