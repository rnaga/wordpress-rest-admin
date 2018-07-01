import React from 'react';
import {compose} from 'recompose';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import withStyles from '../../hoc/withStyles';
import withClickAway from '../../hoc/withClickAway';
import withPostSettings from '../../hoc/withPostSettings';
import IconActionButton from '../IconActionButton';
import Expansion from '../Expansion';
import Status from './settings/Status';
import StatusNoPublish from './settings/StatusNoPublish';
import Categories from './settings/Categories';
import Tags from './settings/Tags';
import Format from './settings/Format';
import Comments from './settings/Comments';
import MoreOptions from './settings/MoreOptions';

const PostSettingsStatus = props => {
    const {edit} = props;

    return (
      <Expansion title='Status'
        subTitle={(
          <div>
            <Typography style={{fontSize: 10}}>
              {edit.private ? 'private' : edit.status}
            </Typography>
          </div>
        )}>
        <Status edit={edit} />
      </Expansion>);
}

const PostSettingsStatusNoPublish = props => {
    const {edit} = props;
    return (
      <Expansion title='Status'
        subTitle={(
          <div>
            <Typography style={{fontSize: 10}}>
              {edit.submit_for_review ? 'submit for review' : 'draft'}
            </Typography>
          </div>
        )}>
        <StatusNoPublish edit={edit} />
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

const PostSettingsComments = props => {
    const {edit} = props;

    return (
      <Expansion title="Comments">
        <Comments edit={edit} />
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

    componentWillMount(){
        const {setClickAway, closePostSettings} = this.props;

        setClickAway({
            onClickAway: closePostSettings,
        }); 
    }

    render(){

        const {cssStyles, 
               children, 
               isPostSettingsOpen,
               setClickAway, 
               closePostSettings} = this.props;

        if(!isPostSettingsOpen())
            return null;

        return ( 
        <div
          ref={ref => setClickAway({ref})}
          style={{display: 'flex', width: '100%', height: 1, justifyContent: 'flex-end'}} 
        >
          <Drawer
              classes={{paper: cssStyles.drawerPaperPost,}}
              anchor='right'
              variant="persistent"
              onClose={closePostSettings}
              open={isPostSettingsOpen()}>

            <div style={{paddingRight: 5, paddingTop: 5, paddingBottom: 10, backgroundColor: '#eeeeee'}}>
              <Typography style={{float: 'left', padding: '20px 0 0 20px', fontWeight: 600, fontSize: '1rem'}}>
                  Post Settings
              </Typography>
              <span style={{float: 'right'}}>
                <IconActionButton type='clear' onClick={closePostSettings} />
              </span>
            </div>

            {children}
          </Drawer></div>);
    }
}

export default compose(
    withStyles,
    withClickAway({key: '_postsettings'}),
    withPostSettings(),
)(PostSettings);


export {
    PostSettingsStatus,
    PostSettingsStatusNoPublish,
    PostSettingsCategoriesAndTags,
    PostSettingsFormat,
    PostSettingsComments,
    PostSettingsMoreOptions,
};



