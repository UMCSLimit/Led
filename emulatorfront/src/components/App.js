import React, { Component } from 'react';
import './../style/App.css';
import Editor from './Editor';
import Emulator from './Emulator';

class App extends Component {
  render() { 
    return (
      <div className="App">
        <div className="LeftSide">
          {this.props.dmxValues}
          <Emulator />
        </div>
        <div className="RightSide">
          <Editor />
        </div>
      </div>
    );
  }
}

export default App;
