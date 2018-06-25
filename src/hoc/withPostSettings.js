import React from 'react';
import withSharedState, {ssNamespaces} from './withSharedState';

const withPostSettings = options => WrappedComponent => {

    class Hoc extends React.Component{

        closePostSettings(){
            const {getSharedState, setSharedState} = this.props;
            const {open = false} = getSharedState();

            open && setSharedState({open: false});
        }

        openPostSettings(options){
            this.props.setSharedState({open: true});
        }

        isPostSettingsOpen(){
            const {open = false} = this.props.getSharedState();
            return open;
        }

        render(){

            return (
              <WrappedComponent 
                {...this.props} 
                closePostSettings={this.closePostSettings.bind(this)}
                openPostSettings={this.openPostSettings.bind(this)}
                isPostSettingsOpen={this.isPostSettingsOpen.bind(this)}
              />);
        }

    }

    return withSharedState({namespace: ssNamespaces.postsettings})(Hoc);
}

export default withPostSettings;
