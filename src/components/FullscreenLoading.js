import React from 'react';
import {compose} from 'recompose';
//import {connect} from 'react-redux';
import withStyles from '../hoc/withStyles';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

class FullscreenLoading extends React.Component{

    render(){

        const {cssStyles, getSharedState} = this.props;
    
        const {open = false} = getSharedState();
    
        if(!this.key || open)
            this.key = Math.random();
        
        return (
          <Dialog
            key={this.key}
            open={open}
            style={{width: '200px', marginLeft: '40%', backgroundColor: 'transparent'}}
            classes={{paper: cssStyles.fullscreenDialogPaper}}
          >
            <DialogContent style={{backgroundColor: 'transparent'}}>
              <CircularProgress 
                size={50}  
                style={{display: 'inline-block', backgroundColor: 'transparent'}} 
                classes={{colorPrimary: cssStyles.fullscreenColorPrimary}}
              />
            </DialogContent>
          </Dialog>);
    }
}

//const mapStateToProps = (state, ownProps) => ({
//    loading: state.loading,
//})

export default compose(
   withStyles,
   withSharedState({namespace: ssNamespaces.loading}),
//   connect(mapStateToProps),
)(FullscreenLoading);
