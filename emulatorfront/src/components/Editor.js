import React, { Component } from 'react';
import HeadEditor from './HeaderEditor';
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-javascript";
import 'ace-builds/src-noconflict/ext-language_tools';
import "ace-builds/src-noconflict/theme-monokai";
import { connect } from 'react-redux'
import { editorChange } from './../actions';

const mapStateToProps = (state) => ({
    code: state.editor.code
});

const mapDispatchToProps = (dispatch) => ({
    onChange: (code) => dispatch(editorChange(code)),
});

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            output: 'siemanko'
        }
    }

    onChange = (newValue) => {
        this.props.onChange(newValue);
    }

    render() {
        return (<div className="textEditor">
            <HeadEditor />
            <AceEditor
                style={{'height': '100%', 'width': '100%', 'borderRadius': '1%'}}
                placeholder="Your code goes here"
                mode="javascript"
                theme="monokai"
                name="mainEditor"
                onChange={this.onChange}
                fontSize={16}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value = {this.props.code}
                editorProps={{ 
                    $blockScrolling: true
                }}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                enableSnippets={true}
          />

        {/* <Notification color="danger">
            Missing ( after console.log
            <Button onClick={() => {}} remove />
        </Notification> */}
        </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);