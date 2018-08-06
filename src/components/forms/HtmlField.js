import React from 'react';
import {compose} from 'recompose';
import { EditorState, convertToRaw,  AtomicBlockUtils, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import withStyles from '../../hoc/withStyles';
import withPostEditor from '../../hoc/withPostEditor'; 
import withActions from '../../hoc/withActions';

import '../../styles/react-draft-wysiwyg.css';

class HtmlField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
        }

        this.eventInsertImageToEditor = this.eventInsertImageToEditor.bind(this);
    }

    contentToEditorState(content){
        const blocksFromHtml = htmlToDraft(content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);

        return editorState;
    }

    eventInsertImageToEditor(e){

        const {startAction, endAction} = this.props;

        startAction();

        const {src, width, height} = e.detail;
        const editorState = this.state.editorState;
        const entityData = {src, height, width};
        const contentStateWithEntity = editorState.getCurrentContent().createEntity('IMAGE', 'IMMUTABLE', entityData);

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        let newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity },);
        newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState,entityKey,' ',);
        this.setState({editorState:newEditorState});

        endAction({message: 'The image has been added to the editor'});
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

    componentWillUnmount(){
        document.removeEventListener(this.props.insertImageEventKey, this.eventInsertImageToEditor, true);
    }

    componentDidMount(){
        const {input, meta, onMount} = this.props;
        if(typeof onMount === 'function')
            onMount(input, meta);

        document.addEventListener(this.props.insertImageEventKey, this.eventInsertImageToEditor, true);
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

export default compose(
    withStyles, 
    withPostEditor(),
    withActions(),
)(HtmlField);



