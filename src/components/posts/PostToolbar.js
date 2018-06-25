import React from 'react';
import withPostSettings from '../../hoc/withPostSettings';
import IconActionButton from '../IconActionButton';

class PostToolbar extends React.Component {

    render(){

        const {
            isCreate,
            openPostSettings, 
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
             <IconActionButton type='settings' label='Settings' labelPlacement='top' onClick={openPostSettings} />
           </div>);
    }
}

export default withPostSettings()(PostToolbar);
