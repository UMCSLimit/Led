import React, { Component } from 'react';
import { connect } from 'react-redux'
import { editorRun } from './../actions';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    run: () => dispatch(editorRun())
});

class HeaderEditor extends Component {
    buttonRun = () => {
        this.props.run();
    }

    // To do: 
    // run code from this component
    // get last logs here
    // get last error

    render() {
        return (<div>
            {/* <button onClick={this.buttonRun}>Run</button> */}
        </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderEditor);