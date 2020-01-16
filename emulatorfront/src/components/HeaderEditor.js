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

    render() {
        return (<div>
            <button onClick={this.buttonRun}>Run</button>
        </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderEditor);