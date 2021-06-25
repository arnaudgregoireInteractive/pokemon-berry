import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Game from './pages/game/game';
import Home from './pages/home';
import Auth from './pages/auth';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/auth' component={Auth}/>
          <Route path='/game' component={Game}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
