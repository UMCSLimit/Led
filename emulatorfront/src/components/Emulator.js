import React, { Component } from 'react';
import HeaderEmulator from './HeaderEmulator';
import Segment from './Segment';

import { connect } from 'react-redux'
import { updateDmx, editorStop } from '../actions'

import { Button, Modal, Form, Icon } from 'react-bulma-components';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import { store } from 'react-notifications-component';

const io = require('socket.io-client');

const mapStateToProps = (state) => ({
    dmxValues: state.dmx.text,
    code: state.editor.code,
    run: state.editor.run
});

const mapDispatchToProps = (dispatch) => ({
    onClick: (text) => dispatch(updateDmx(text)),
    editorStop: () => dispatch(editorStop())
});

class Emulator extends Component {
    constructor(props) {
        super(props);
        let values = this.initValues();
        this.state = {
            updateInterval: null,
            i: 0,
            values: values,
            segments: null,
            socket: null,
            running: false,
            dmxFlag: 'black',
            showModal: false,
            sending: false,
            modalName: '',
            modalDescription: ''
        };
    }

    initValues = () => {
        let values = [];
        for (let i = 0; i < 5; i++) {
            let tmp = []
            for (let j = 0; j < 28; j++) {
                tmp.push([0, 0, 0]);
            }
            values.push(tmp);
        }
        return values;
    }

    componentDidMount() {

        const socket = io.connect('http://localhost:3002');
        this.setState({socket: socket })
        socket.on('connection', (socket) => {
          console.log('connected');
        })
        
        socket.on('update', (payload) => {
          this.setState({values: payload});
          if (this.state.dmxFlag === 'black') 
            this.setState({dmxFlag: 'red'});
          else
            this.setState({dmxFlag: 'black'})
        })

        socket.on('my_error', (payload) => {
            store.addNotification({
                title: "Error!",
                message: payload,
                type: "danger",
                insert: "top",
                container: "bottom-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              });
            this.setState({running: false});
        })

        socket.on('log', (payload) => {
            store.addNotification({
                title: "console.log",
                message: `${payload}`,
                type: "info",
                insert: "top",
                container: "bottom-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 3000,
                  onScreen: true
                }
              });
        })

        let segments = this.generateSegments();
        this.setState({
            segments: segments
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalDmx);
    }

    generateSegments() {
        let segments = [];
        for (let i = 0; i < 5; i++) {
            let segmentsRow = [];
            
            for (let j = 0; j < 28; j++) {
                let color = [0, 0, 0];
                color = this.state.values[i][j];
                segmentsRow.push(<Segment key={i * 5 + j} color={color}/>);
            }
            
            if(i == 0) {
                segments.push(<div key={i} background="blue" style={{display: "flex"}}>{segmentsRow}</div>);
            } else {
                segments.push(<div key={i} style={{display: "flex"}}>{segmentsRow}</div>);
            }

        }
        return <div style={{display: "block", alignItems: "center"}}>{segments}</div>
    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    ladder = async () => {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 28; j++) {
                let values = this.state.values;
                values[i][j][0] += 50;
                this.setState({ values });
                await this.sleep(46);
            }
        }
    }

    buttonClick = () => {
        this.setState({running: false});
        this.state.socket.emit('off');
    }

    runCode = () => {
        this.setState({running: true});
        this.state.socket.emit('code', this.props.code);
    }

    onModalChange = (evt) => {
        const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
        this.setState({
            [evt.target.name]: value,
          });
    }

    render() {

        const { modalName, modalDescription } = this.state;

        return (<div>
            <ReactNotification />
            <HeaderEmulator/>

            {/* <div>
                <div style={{width: '20px', height: '20px', backgroundColor: this.state.dmxFlag, borderRadius: '50%', marginLeft: '20px'}}></div>
            </div> */}

            { !this.state.running && <Button style={{'margin': '5px'}} color="primary" onClick={this.runCode}> Run Code</Button> }
            { this.state.running  && <Button style={{'margin': '5px'}} color="danger" onClick={this.buttonClick}>Stop</Button> }

            {this.generateSegments()}

            {/* <FontAwesomeIcon icon={faCaretRight} size="2x" color="white"/> */}

            <Button style={{'margin': '5px'}} onClick={() => { this.setState({showModal: true})}} color="light">
                Share your code!
            </Button>

            <Modal show={this.state.showModal} modal={{closeOnEsc: true}} closeOnBlur={true} onClose={() => {this.setState({showModal: false})}}> 
                <Modal.Card>
                    <Modal.Card.Head>
                        <Modal.Card.Title>
                            Share your code with us!
                        </Modal.Card.Title>
                        {/* <Button remove /> */}
                    </Modal.Card.Head>
                    <Modal.Card.Body>
                        {!this.state.sending &&                         
                            <Form.Field>
                                <Form.Label>Your name</Form.Label>
                                <Form.Control>
                                    <Form.Input placeholder="Name input" onChange={this.onModalChange} name="modalName" type="text" value={modalName}/>
                                </Form.Control>
                            </Form.Field>
                        }
                        { !this.state.sending && 
                            <Form.Field>
                                <Form.Label>Description</Form.Label>
                                <Form.Control>
                                <Form.Textarea placeholder="Description" onChange={this.onModalChange} name="modalDescription" value={modalDescription} />
                                </Form.Control>
                            </Form.Field>
                        }
                        {this.state.sending && 
                            <h1>Sending...</h1>    
                        }
                    </Modal.Card.Body>
                    <Modal.Card.Foot style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {!this.state.sending && 
                            <Form.Field kind="group">
                                <Form.Control>
                                <Button onClick={() => {this.setState({sending: true})}} type="primary">Submit</Button>
                                </Form.Control>
                                <Form.Control>
                                <Button onClick={() => {this.setState({showModal: false})}} color="link">Cancel</Button>
                                </Form.Control>
                            </Form.Field>
                        }
                    </Modal.Card.Foot>
                </Modal.Card>
            </Modal>

            <Form.Field>
                <Form.Control>
                    <Form.Checkbox>
                        Live mode
                    </Form.Checkbox>
                    {/* <Checkbox name="termsAccepted" onChange={this.onChange} checked={termsAccepted}>
                    I agree to the <a href="#agree">terms and conditions</a>
                    </Checkbox> */}
                </Form.Control>
            </Form.Field>
        </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Emulator);
