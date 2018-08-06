import React from 'react';
import {compose} from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import withStyles from '../hoc/withStyles';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';
import withWidth from '../hoc/withWidth';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Form from './Form';
import {SaveButton, CancelButton} from './ActionButton';
import IconActionButton from './IconActionButton';

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

        const {getSharedState, cssStyles, width} = this.props;
        const content = this.createContent();

        const {open = false} = getSharedState();

        if(!content) 
            return null;

        let classes = {};

        if(width === 'lg' || width === 'xl')
            classes = {paper: cssStyles.dialogPaperLg};
        else if(width === 'md' || width === 'sm')
            classes = {paper: cssStyles.dialogPaperMd};

        return (
        <Dialog
          fullScreen={width === 'xs'}
          classes={classes} 
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          {width === 'xs' &&
            <div>
              <IconActionButton type='close' onClick={this.handleClose} style={{float: 'right'}} />
            </div>}
          {content}
        </Dialog>);
    }
} 

export default compose(
  withMobileDialog(),
  withWidth(),
  withStyles,
  withSharedState({namespace: ssNamespaces.dialogform}),
)(DialogForm);



