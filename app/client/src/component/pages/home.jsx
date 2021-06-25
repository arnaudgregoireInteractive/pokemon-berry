import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
    return (
    <div className="App">
      <h1>Home</h1>
      {/* Link to List.js */}
      <Link to={'./auth'}>
        <button variant="raised">
            Play
        </button>
      </Link>
    </div>
    );
  }
}
export default Home;
