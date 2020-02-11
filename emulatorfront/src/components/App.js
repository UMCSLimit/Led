import React, { Component } from 'react';
import './../style/App.css';
import Editor from './Editor';
import Emulator from './Emulator';
import AnimationQueue from './AnimationQueue';
import 'react-bulma-components/dist/react-bulma-components.min.css';

class App extends Component {
  render() { 
    return (
      <div className="App">
        <div className="LeftSide">
          {this.props.dmxValues}
          <Emulator />
          <AnimationQueue />
        </div>
        <div className="RightSide">
          <Editor />
        </div>
      </div>
    );
  }
}

export default App;
