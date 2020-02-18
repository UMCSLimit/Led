import React, { Component } from 'react';
import { connect } from 'react-redux';
import './../style/App.css';

import Editor from './Editor';
import Emulator from './Emulator';
import AnimationQueue from './AnimationQueue';
import FormAnimation from './FormAnimation';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Form, Button } from 'react-bulma-components';
import { Animated } from "react-animated-css";

import { modalShow, emulatorLiveMode } from '../actions';

const mapStateToProps = (state) => ({
  liveMode: state.emulator.liveMode
});

const mapDispatchToProps = (dispatch) => ({
  modalShow: () => dispatch(modalShow()),
  emulatorLiveMode: () => dispatch(emulatorLiveMode()),
});

class App extends Component {
  render() { 
    const { liveMode, modalShow } = this.props;
    return (
      <div className="App">
        <div className="LeftSide">
          <Form.Field>
                <Form.Control>
                    <Form.Checkbox onChange={this.props.emulatorLiveMode} checked={liveMode}>
                        Live mode
                    </Form.Checkbox>
                </Form.Control>
            </Form.Field>
          <Emulator />
          <Button style={{'margin': '5px'}} onClick={modalShow} color="light">
                Share your code!
          </Button>
          <FormAnimation />
        </div>
        <div className="RightSide">

          <Animated animationIn="fadeInRight" animationOut="fadeOutRight" isVisible={liveMode}>
              <AnimationQueue/>
          </Animated>

          <Animated animationIn="fadeInRight" animationOut="fadeOutRight" isVisible={!liveMode}>
              <Editor />
          </Animated>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
