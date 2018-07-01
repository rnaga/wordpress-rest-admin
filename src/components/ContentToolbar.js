import React from 'react';
import {compose} from 'recompose';
import withStyles from '../hoc/withStyles';
import withCurrentContent from '../hoc/withCurrentContent';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';

const ContentToolbar = props => {

   const {content, pageName, cssStyles} = props;

    const {element = null} = props.getSharedState();

    const title = (!content || !pageName) 
                ? '' : content.routes[pageName].label;
    return (
      <div style={{marginTop: 15}} >
        <span className={cssStyles.contentTitle} >
          {title}
        </span>
        {element}
      </div>);
}

export default compose(
    withCurrentContent,
    withSharedState({namespace: ssNamespaces.contenttoolbar}),
    withStyles,
)(ContentToolbar);
