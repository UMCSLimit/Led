import React, { Component } from 'react';
import HeaderEmulator from './HeaderEmulator';
import Segment from './Segment';

import { connect } from 'react-redux'
import { updateDmx, editorStop } from '../actions'

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

    dmxUpdate = () => {

    }

    componentDidMount() {
        // const intervalDmx = setInterval(() => this.dmxUpdate(), 100);
        // this.setState({ intervalDmx })

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
            segments.push(<div key={i} style={{display: "flex"}}>{segmentsRow}</div>);
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
        this.ladder();
    }

    runCode = () => {

        // Try to use these dependencies:
        // 1. vm
        // 2. vm2
        // 3. Contextify
        // 4. Isolated-vm

        // We want to update state.values async every 46 ms
        // Try Catch on eval won't catch anything !!

        let values = this.state.values;
        let code = "function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));} (async () => {" + this.props.code + "})()";
        try {
            eval( code)
        } catch (error) {
            console.log(error);
        }
        let interv = setInterval(() => {
            this.setState({values: values});
        }, 46);
        setTimeout(() => {clearInterval(interv)}, 5000);
        this.props.editorStop();
    }

    render() {
        return (<div>
            <HeaderEmulator/>
            <h1>Emulator here</h1>
            {this.generateSegments()}
            
            {/* {this.state.segments} */}

            {this.props.run && this.runCode()}

            <p>{this.state.i}</p>
            <button onClick={this.buttonClick}>Button</button>
        </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Emulator);