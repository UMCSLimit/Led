import React, { Component } from 'react';
import HeaderEmulator from './HeaderEmulator';
import Segment from './Segment';
import { connect } from 'react-redux'
import { updateDmx, editorStop, editorChange, queueChange } from '../actions'
import { Button, Modal, Form, Container } from 'react-bulma-components';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

const { ipcRenderer } = require('electron')
const io = require('socket.io-client');

const mapStateToProps = (state) => ({
    dmxValues: state.dmx.text,
    code: state.editor.code,
    run: state.editor.run
});

const mapDispatchToProps = (dispatch) => ({
    onClick: (text) => dispatch(updateDmx(text)),
    editorStop: () => dispatch(editorStop()),
    codeChange: (code) => dispatch(editorChange(code)),
    queueChange: (queue) => dispatch(queueChange(queue)),
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
            modalDescription: '',
            queue: []
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
        ipcRenderer.on('log',    this.ipcLog);
        ipcRenderer.on('stop',   this.ipcStop);
        ipcRenderer.on('error',  this.ipcError);
        ipcRenderer.on('queue',  this.ipcQueue);
        ipcRenderer.on('save',   this.ipcGetCode);
        ipcRenderer.on('update', this.ipcUpdate);

        const socket = io.connect('http://localhost:3002');
        this.setState({socket: socket })
        socket.on('connection', (socket) => {
          console.log('connected');
        })
        socket.on('update', (payload) => {
            // console.log(payload);
            // this.setState({values: payload});

        });

        let segments = this.generateSegments();
        this.setState({
            segments: segments
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalDmx);

        ipcRenderer.removeListener('log',    this.ipcLog);
        ipcRenderer.removeListener('stop',   this.ipcLog);
        ipcRenderer.removeListener('error',  this.ipcError);
        ipcRenderer.removeListener('queue',  this.ipcQueue);
        ipcRenderer.removeListener('save',   this.ipcGetCode);
        ipcRenderer.removeListener('update', this.ipcUpdate);
    }

    ipcLoadCode = (event, args) => {
        this.props.codeChange(args);

        // code loaded
    }

    ipcGetCode = (event, args) => {
        ipcRenderer.send('save', this.props.code)
    }

    ipcStop = (event, args) => {
        this.setState({ running: false});
    }

    ipcUpdate = (event, args) => {
        // console.log(args);

        this.setState({values: args});
        if (this.state.dmxFlag === 'black') this.setState({dmxFlag: 'red'});
        else this.setState({dmxFlag: 'black'})
    }

    ipcError = (event, args) => {
        store.addNotification({
            title: "Error!",
            message: args,
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
    }

    ipcLog = (event, args) => {
        store.addNotification({
            title: "console.log",
            message: `${args}`,
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
    }

    ipcQueue = (event, args) => {
        // console.log(args);
        this.setState({queue: [ args.playing, ...args.queue ]});

        this.props.queueChange([ args.playing, ...args.queue ]);
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
            
            if(i === 0) {
                segments.push(<div key={i} background="blue" style={{display: "flex"}}>{segmentsRow}</div>);
            } else {
                segments.push(<div key={i} style={{display: "flex"}}>{segmentsRow}</div>);
            }

        }
        return <Container style={{ width:'90%', display: "block", alignItems: "center"}}>{segments}</Container>
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
        ipcRenderer.send('off');
        // this.state.socket.emit('off');
    }

    runCode = () => {
        this.setState({running: true});
        ipcRenderer.send('code', this.props.code);
        // this.state.socket.emit('code', this.props.code);
    }

    onModalChange = (evt) => {
        const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
        this.setState({
            [evt.target.name]: value,
        });
    }

    render() {

        const { modalName, modalDescription } = this.state;

        return (<Container>
            <ReactNotification />
            <HeaderEmulator/>

            {/* 
                <div>
                    <div style={{width: '20px', height: '20px', backgroundColor: this.state.dmxFlag, borderRadius: '50%', marginLeft: '20px'}}></div>
                </div> 
            */}

            { !this.state.running && <Button style={{'margin': '15px'}} color="primary" onClick={this.runCode}> Run Code</Button> }
            { this.state.running  && <Button style={{'margin': '15px'}} color="danger" onClick={this.buttonClick}>Stop</Button> }

            {this.generateSegments()}

            {/* <FontAwesomeIcon icon={faCaretRight} size="2x" color="white"/> */}
            {/* <Button onClick={() => {ipcRenderer.send('asynchronous-message', 'ping')}}>Ping</Button> */}

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

                    {/* { this.state.queue.forEach((item) => <div><h1>{item.id} - {item.name}</h1></div>)} */}

            {/* <Form.Field>
                <Form.Control>
                    <Form.Checkbox onChange={() => {this.setState({liveMode: !this.state.liveMode})}} checked={this.state.liveMode}>
                        Live mode
                    </Form.Checkbox>
                </Form.Control>
            </Form.Field>
             */}
            {/* <Checkbox name="termsAccepted" onChange={this.onChange} checked={termsAccepted}>
            I agree to the <a href="#agree">terms and conditions</a>
            </Checkbox> */}
            
        </Container>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Emulator);
