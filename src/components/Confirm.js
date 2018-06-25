import React from 'react';
import {compose} from 'recompose';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';

class Confirm extends React.Component {

    handleNo = () => {
        const {getSharedState, setSharedState} = this.props;

        const {onNo = null} = getSharedState();
        onNo && onNo();
        setSharedState({open: false});

    };
  
    handleYes = () => {
        const {getSharedState, setSharedState} = this.props;

        const {onYes = null} = getSharedState();
        onYes && onYes();
        setSharedState({open: false});
    }
  
    render() {
        const {open = false, message = '', title = ''} = this.props.getSharedState();

        if(!open)
            return null;

        return (
          <div>
            <Dialog
              key={Math.random()}
              open={open}
              onClose={this.handleClose}
              aria-labelledby="confirm"
            >
              <DialogTitle id="confirm">{title}</DialogTitle>
              <DialogContent>
                <DialogContentText style={{color: 'black'}}>
                {message}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleYes} color="primary">
                  Yes
                </Button>
                <Button onClick={this.handleNo} color="primary">
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
    }
}

export default compose(
    withSharedState({namespace: ssNamespaces.confirm}),
)(Confirm);
