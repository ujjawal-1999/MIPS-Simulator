import React, { Component } from 'react';
import './App.css';
import IDE from "./Views/IDE";
import Registers from "./Views/Registers";

class App extends Component {
  render() {
    return (
      <div id="App">
          <IDE />
          <Registers />
      </div>
    );
  }
}

export default App;
