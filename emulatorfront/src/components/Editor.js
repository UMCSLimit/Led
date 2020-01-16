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
    onChange = (newValue) => {
        this.props.onChange(newValue);
    }

    render() {
        return (<div className="textEditor">
            <HeadEditor />
            <AceEditor
                placeholder="Hej, wpisz tutaj swoj tekst"
                mode="javascript"
                theme="monokai"
                name="mainEditor"
                onChange={this.onChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}

                value = {this.props.code}
//                 value={`function onLoad(editor) {
//   console.log("i've  loaded");
// }`}

                editorProps={{ 
                $blockScrolling: true
                }}

                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                enableSnippets={true}
          />
        </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);