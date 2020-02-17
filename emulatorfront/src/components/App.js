import React, { Component } from 'react';
import './../style/App.css';
import Editor from './Editor';
import Emulator from './Emulator';
import AnimationQueue from './AnimationQueue';
import 'react-bulma-components/dist/react-bulma-components.min.css';

import { Form, Box, Hero, Footer, Container, Content } from 'react-bulma-components';

import {Animated} from "react-animated-css";

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
        </div>
        <div className="RightSide">

          <Animated animationIn="fadeInRight" animationOut="fadeOutRight" isVisible={this.state.liveMode}>
              <AnimationQueue/>
          </Animated>

          <Animated animationIn="fadeInRight" animationOut="fadeOutRight" isVisible={!this.state.liveMode}>
              <Editor />
          </Animated>
        </div>

        {/* <Footer style={{ 'padding': '3rem 1.5rem 3rem' }}>
          <Container>
            <Content style={{ textAlign: 'center' }}>
              <p>
                <strong>Bulma</strong> by <a href="http://jgthms.com">Jeremy Thomas</a>. The source code is licensed
                <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
                is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
                </p>
              </Content>
            </Container>
          </Footer> */}

      {/* <Hero size="fullheight" style={{ 'backgroundColor': '#e4e4e4'}}>
        <Hero.Head renderAs="header" />
        <Hero.Body>

        </Hero.Body>
        <Hero.Footer>
          </Hero.Footer>
        </Hero> */}


      </div>
    );
  }
}

export default App;
