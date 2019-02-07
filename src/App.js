import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './responsive.css';
import Diamondboardlayout from './Diamondboardlayout';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Welcome to Diamond Search Game
         </header>
         <Diamondboardlayout />
      </div>
    );
  }
}

export default App;
