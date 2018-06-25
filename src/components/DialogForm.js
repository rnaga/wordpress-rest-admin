import React from 'react';
import {compose} from 'recompose';
import withStyles from '../hoc/withStyles';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Form from './Form';
import {SaveButton, CancelButton} from './ActionButton';

class DialogForm extends React.Component{

    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }    

    handleClose(e){

        const {getSharedState, setSharedState} = this.props;

        const {onClose = null} = getSharedState();

        setSharedState({open: false});

        if(typeof onClose === 'function')
            onClose();
    }

    createContent(){

        let {open = false, 
               form, 
               content, 
               onSubmit = () => {}, 
               actionButtons,
        } = this.props.getSharedState();

        if(!open)
            return null;

        actionButtons = Array.isArray(actionButtons) ? actionButtons : [
            <SaveButton key='save' type='submit' />,
            <CancelButton key='cancel' onClick={this.handleClose} />,
        ];

        const elem = (<div>
          <Form form={form}
            onSubmit={onSubmit}
            handleClose={this.handleClose}>
            <DialogContent>
              {content}
              {actionButtons.map( (e,i) => {
                  return [e, <span key={i} style={{paddingRight: 10}} />];
              })}
            </DialogContent>
          </Form></div>);

        return elem;
        
    }

    render(){

        const {getSharedState, cssStyles} = this.props;
        const content = this.createContent();

        const {open = false} = getSharedState();

        if(!content) 
            return null;

        return (
        <Dialog
          classes={{paper: cssStyles.dialogPaper}} 
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          {content}
        </Dialog>);
    }
} 

export default compose(
  withStyles,
  withSharedState({namespace: ssNamespaces.dialogform}),
)(DialogForm);



