import React from 'react';
import {compose} from 'recompose';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import withStyles from '../../hoc/withStyles';

import '../../styles/react-draft-wysiwyg.css';

class HtmlField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
        }
    }

    contentToEditorState(content){
        const blocksFromHtml = htmlToDraft(content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);

        return editorState;
    }

    componentWillMount(){

        const {input, defaultValue} = this.props;

        if(defaultValue && !input.value){
            input.onChange(defaultValue);
        }

        if(defaultValue || input.value){
            const initEditorState = this.contentToEditorState(input.value ? input.value : defaultValue);
            this.setState({
                editorState: initEditorState
            });
        }
    }

    componentDidMount(){
        const {input, meta, onMount} = this.props;
        if(typeof onMount === 'function')
            onMount(input, meta);
    }

    handleEditorStateChange(editorState){

        const {input, onInputChange} = this.props;

        const newHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        input.onChange(newHtml);

        this.setState({
            editorState,
        });

        if(onInputChange)
            onInputChange(newHtml, input);
    }

    render(){
        const {editorState} = this.state;

        return (<div style={{backgroundColor: 'white', paddingTop: 10}}>
          <Editor
            editorState={editorState}
            onEditorStateChange={this.handleEditorStateChange.bind(this)}
          /></div>);
    }
}


export default compose(withStyles)(HtmlField);
