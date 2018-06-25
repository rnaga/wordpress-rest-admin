import React from 'react';
import {compose} from 'recompose';
//import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import withStyles from '../hoc/withStyles';
import withCurrentContent from '../hoc/withCurrentContent';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';

//import withContentToolbar from '../hoc/withContentToolbar';

const ContentToolbar = props => {

//    const {currentContent: {content, pageName}, cssStyles} = props;
   const {content, pageName, cssStyles} = props;

    const {element = null} = props.getSharedState();

    const title = (!content || !pageName) 
                ? '' : content.routes[pageName].label;
    return (
      <div style={{marginTop: 15}} >
{/*
      <div style={{position: 'relative', height: 30}} >
*/}
        <Typography className={cssStyles.contentTitle} >
          {title}
        </Typography>
        {element}
      </div>);
}

/*
const mapStateToProps = (state) => {
  return {
      contentToolbar: state.contentToolbar,
  }
};
*/

export default compose(
//    connect(mapStateToProps, null),
    withCurrentContent,
//    withContentToolbar,
    withSharedState({namespace: ssNamespaces.contenttoolbar}),
    withStyles,
)(ContentToolbar);
