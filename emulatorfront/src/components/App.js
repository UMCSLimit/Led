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

import { modalShow } from '../actions';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  modalShow: () => dispatch(modalShow())
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveMode: false
    }
  }

  render() { 
    return (
      <div className="App">
        <div className="LeftSide">
          <Form.Field>
                <Form.Control>
                    <Form.Checkbox onChange={() => {this.setState({liveMode: !this.state.liveMode})}} checked={this.state.liveMode}>
                        Live mode
                    </Form.Checkbox>
                </Form.Control>
            </Form.Field>
          <Emulator />
          <Button style={{'margin': '5px'}} onClick={this.props.modalShow} color="light">
                Share your code!
          </Button>
          <FormAnimation />
        </div>
        <div className="RightSide">

          <Animated animationIn="fadeInRight" animationOut="fadeOutRight" isVisible={this.state.liveMode}>
              <AnimationQueue/>
          </Animated>

          <Animated animationIn="fadeInRight" animationOut="fadeOutRight" isVisible={!this.state.liveMode}>
              <Editor />
          </Animated>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
