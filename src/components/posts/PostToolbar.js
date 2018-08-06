import React from 'react';
import {compose} from 'recompose';
import withPostSettings from '../../hoc/withPostSettings';
import withPostMedia from '../../hoc/withPostMedia';
import IconActionButton from '../IconActionButton';

class PostToolbar extends React.Component {

    render(){

        const {
            isCreate,
            openPostSettings, 
            openPostMedia,
            onDelete, 
            onSubmit} = this.props;

        const style = {
            display: 'flex', 
            width: '100%', 
            justifyContent: 'flex-end', 
            borderBottom: '1px solid #eeeeee',
        };

        return(
           <div style={style} >
             <IconActionButton type='save' label='Save' labelPlacement='top' onClick={onSubmit}/>
             {!isCreate &&
             <IconActionButton type='delete' label='Trash' labelPlacement='top' onClick={onDelete} />}
             <IconActionButton type='image' label='Media Files' labelPlacement='top' onClick={openPostMedia} style={{color: '#f48f42'}} />
             <IconActionButton type='settings' label='Settings' labelPlacement='top' onClick={openPostSettings} />
           </div>);
    }
}

export default compose(
    withPostSettings(),
    withPostMedia(),
)(PostToolbar);
