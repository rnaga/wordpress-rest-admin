import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import withDropzone from '../hoc/withDropzone';
import IconActionButton from './IconActionButton';
import {FileButton} from './ActionButton';
import showError from '../util/showError';

class Dropzone extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            active: false,
            openDropzone: false,
        };
    }

    componentWillMount(){

        var lastTarget = null;

        window.ondragenter = e => {
            lastTarget = e.target;
            this.setState({active: true});
        }

        window.ondragleave = e => {
            if(e.target === lastTarget || e.target === document)
                this.setState({active: false});
        }

        window.ondragover = e => {
           e.stopPropagation();
           e.preventDefault();
        }

        window.ondrop = e => {
            e.stopPropagation();
            e.preventDefault();
            this.handleDrop(e.dataTransfer.files);
        }
    }
/*
    componentWillUnmount(){
        window.ondragenter = window.ondragleave =
        window.ondragover = window.ondrop = null;
    }
*/
    handleDrop(files){

        const {onChange, dispatch} = this.props;

        var reader = new FileReader();

        reader.onload = e => {

            const fileType = files[0].type;

            if(typeof fileType !== 'string' || !fileType.match(/^image\//)){
                showError(dispatch, 'Only images can be uploaded');
                return;
            }

            if(typeof onChange === 'function')
                onChange(1, files[0]);
         }
    
         reader.readAsDataURL(files[0]); 

         this.setState({active: false});
    }

    handleDragEnter() {
        this.setState({active: true});
    }

    handleDragLeave() {
        this.setState({active: false});
    }

    renderFullscreen(){

        const overlayStyle = {
            position: 'fixed',
            zIndex: 2000,
            width: '100%',
            height: '100%',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            padding: '2.5em 0',
            background: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#fff',
            verticalAlign: 'middle',
        };

        return (
        <div style={overlayStyle}>
          <div style={{position: 'relative', top: '50%', transform: 'translateY(-50%)'}} >
            Drop files...
          </div>
        </div>);
    }

    renderForm(){

        const {closeDropzone} = this.props;

        return (<div
              style={{
                width: '100%',
                height: 130,
                borderWidth: 2,
                borderColor: 'rgb(102, 102, 102)',
                borderStyle: 'dashed',
                borderRadius: 0,
                textAlign: 'center',

             }}>        

              <span style={{float: 'right'}}>
                <IconActionButton type='clear' onClick={e => {closeDropzone()}} />
              </span>

             <div style={{textAlign: 'center'}}>
                <h2 style={{fontSize: '1.1rem', fontWeight: 500}}>
                  Drop files anywhere to upload
                </h2> 
                <p style={{margin: 0}}>or</p> 
                <FileButton 
                  label='Select Files' 
                  variant="flat" 
                  onChange={e => this.handleDrop(e.target.files)}
                  type='file'
                  style={{
                      marginLeft: -50,
                      marginTop: 10,
                      border: '1px solid', 
                      backgroundColor: '#f2f7ff',
                      '&:hover': {
                        backgroundColor: '#f9f9f9',
                      }
                  }} 
                />
             </div>

        </div>);
    }

    render(){

        const {active} = this.state;
        const {isDropzoneOpen} = this.props;

        return (<div>
          {isDropzoneOpen() && this.renderForm()}
          {active && this.renderFullscreen()}
        </div>);
    }
}

export default compose(
    connect(),
    withDropzone(),
)(Dropzone);



