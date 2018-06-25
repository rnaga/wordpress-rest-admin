import React from 'react';
import {compose} from 'recompose';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography';
import withStyles from '../hoc/withStyles';
import withClickAway from '../hoc/withClickAway';
import IconActionButton from './IconActionButton';
import Expansion from './Expansion';

import Status from './post-settings/Status';
import Categories from './post-settings/Categories';
import Tags from './post-settings/Tags';
import Format from './post-settings/Format';
import MoreOptions from './post-settings/MoreOptions';

const PostSettingsStatus = props => {
    const {edit} = props;


    return (
      <Expansion title='Status'
        subTitle={(
          <div>
            <Typography style={{fontSize: 10}}>{edit.status}</Typography>
          </div>
        )}>
        <Status edit={edit} />
      </Expansion>);
}


const PostSettingsCategoriesAndTags = props => {

    const {edit} = props;

    return (
      <Expansion title='Categories & Tags'
        subTitle={(
          <div>
          <Typography style={{fontSize: 10, paddingRight: 10, display: 'inline'}}>
            {Array.isArray(edit.categories) &&
              `${edit.categories.length} categories`}
          </Typography>
          <Typography style={{fontSize: 10, display: 'inline'}}>
            {Array.isArray(edit.tagsRaw) &&
              `${edit.tagsRaw.length} tags`}
          </Typography>
          </div>)}
      >
        <div>
          <Typography>Categories</Typography >
          <Categories edit={edit} />
          <Typography style={{paddingTop: 15}}>Tags</Typography >
          <Tags edit={edit} />
        </div>
      </Expansion>);
}

const PostSettingsFormat = props => {

    const {edit} = props;

    return (
      <Expansion title="Post Format"
        subTitle={(
          <div>
            <Typography style={{fontSize: 10}}>{edit.format}</Typography>
          </div>
        )}>
        <Format edit={edit} />
      </Expansion>
    );
}

const PostSettingsMoreOptions = props => {
    const {edit} = props;

    return (
      <Expansion title="More Options">
        <MoreOptions edit={edit} />
      </Expansion>
    );

}

class PostSettings extends React.Component {

    render(){

        const {cssStyles, open, closeSettings, children} = this.props;

        return ( <div style={{display: 'flex', width: '100%', height: 1, justifyContent: 'flex-end'}} >
          <Drawer
              classes={{paper: cssStyles.drawerPaperPost,}}
              anchor='right'
              variant="persistent"
              onClose={closeSettings}
              open={open}>

            <div style={{paddingRight: 5, paddingTop: 5, backgroundColor: '#eeeeee'}}>
              <Typography style={{float: 'left', padding: '20px 0 0 20px', fontWeight: 600, fontSize: '1rem'}}>Post Settings</Typography>
              <span style={{float: 'right'}}>
                <IconActionButton type='clear' onClick={closeSettings} />
              </span>
            </div>

            {children}
          </Drawer></div>);
    }
}

export default compose(
    withStyles,
    withClickAway,
)(PostSettings);

export {
    PostSettingsStatus,
    PostSettingsCategoriesAndTags,
    PostSettingsFormat,
    PostSettingsMoreOptions,
};





