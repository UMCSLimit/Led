import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Container } from 'react-bulma-components';

import Segment from './Segment';
import HeaderEmulator from './HeaderEmulator';

import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { updateDmx, editorStop, editorChange, queueChange, 
    emulatorLog, emulatorError, emulatorRun, emulatorStop } from '../actions';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

const { ipcRenderer } = require('electron'); // if electron
const io = require('socket.io-client');


const mapStateToProps = (state) => ({
    dmxValues: state.dmx.text,
    code: state.editor.code,
    run: state.editor.run,
    emulatorRunning: state.emulator.running,
    liveMode: state.emulator.liveMode,
});

const mapDispatchToProps = (dispatch) => ({
    onClick: (text) => dispatch(updateDmx(text)),
    editorStop: () => dispatch(editorStop()),
    codeChange: (code) => dispatch(editorChange(code)),
    queueChange: (queue) => dispatch(queueChange(queue)),
    emulatorLog: (log) => dispatch(emulatorLog(log)),
    emulatorError: (error) => dispatch(emulatorError(error)),
    emulatorRun: () => dispatch(emulatorRun()),
    emulatorStop: () => dispatch(emulatorStop()),
});

class Emulator extends Component {
    constructor(props) {
        super(props);
        let values = this.initValues();
        this.state = {
            updateInterval: null,
            values: values,
            segments: null,
            socket: null,
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
            if (this.props.liveMode)
                this.setState({values: payload});
        });

        socket.on('queue', (queue) => {
            if (this.props.liveMode)
                this.props.queueChange([ queue.playing, ...queue.queue ]);
        })

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
    }

    ipcGetCode = (event, args) => {
        ipcRenderer.send('save', this.props.code)
    }

    ipcStop = (event, args) => {
        this.props.emulatorStop();
    }

    ipcUpdate = (event, args) => {
        if (!this.props.liveMode)
            this.setState({values: args});
    }

    ipcError = (event, args) => {
        this.props.emulatorError(args);
        this.props.emulatorStop();

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
    }

    ipcLog = (event, args) => {
        this.props.emulatorLog(`${args}`);

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
        this.props.queueChange([ args.playing, ...args.queue ]);
    }

    generateSegments() {
        let segments = [];
        for (let i = 0; i < 5; i++) {
            let segmentsRow = [];
            
            for (let j = 0; j < 28; j++) {
                let color = [0, 0, 0];
                color = this.state.values[i][j];
                segmentsRow.push(<Segment id={i*28+j} key={i*28+j} color={color}/>);
            }
            
            if(i === 0) {
                segments.push(<div key={i} background="blue" style={{display: "flex"}}>{segmentsRow}</div>);
            } else {
                segments.push(<div key={i} style={{display: "flex"}}>{segmentsRow}</div>);
            }

        }
        return <Container style={{ width:'90%', display: "block", alignItems: "center"}}>{segments}</Container>
    }

    buttonClick = () => {
        // this.props.emulatorStop();
        ipcRenderer.send('off');

        // this.state.socket.emit('off');
    }

    runCode = () => {
        this.props.emulatorRun();
        ipcRenderer.send('code', this.props.code);
        
        // this.state.socket.emit('code', this.props.code);
    }

    render() {
        let { emulatorRunning } = this.props;

        return (<Container>
            <ReactNotification />
            <HeaderEmulator/>

            { !emulatorRunning && <Button style={{'margin': '15px'}} color="primary" onClick={this.runCode}> Run Code</Button> }
            { emulatorRunning  && <Button style={{'margin': '15px'}} color="danger" onClick={this.buttonClick}>Stop</Button> }

            {this.generateSegments()}

            {/* <FontAwesomeIcon icon={faCaretRight} size="2x" color="white"/> */}
            
        </Container>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Emulator);
