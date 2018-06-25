import React from 'react';
import {compose} from 'recompose';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';
import withStyles from '../hoc/withStyles';
import MuiSnackbar from '@material-ui/core/Snackbar';
import getIcon from '../util/getIcon';
import IconButton from '@material-ui/core/IconButton';

class Snackbar extends React.Component {

  handleClose(){

      const {getSharedState, setSharedState} = this.props;

      const {open = false, onClose = null} = getSharedState();

      if(open){
          setSharedState({open: false});
          onClose && onClose();
      }
  }

  render() {

    const {open = false, 
           duration = 3000, 
           message = ''
    } = this.props.getSharedState();

    const Close = getIcon({iconName: 'Close'});

    if(!open) 
        return null;

    return (
        <div>
        <MuiSnackbar
//          style={{float: 'right'}}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={open}
          autoHideDuration={duration}
          onClose={this.handleClose.bind(this)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose.bind(this)}
            >
              <Close />
            </IconButton>,
          ]}
        />
    </div>);
  }
}

export default compose(
  withStyles,
  withSharedState({namespace: ssNamespaces.snackbar}),
)(Snackbar);
