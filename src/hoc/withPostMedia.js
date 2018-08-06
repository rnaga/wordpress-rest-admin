import React from 'react';
import withSharedState, {ssNamespaces} from './withSharedState';

const withPostMedia = options => WrappedComponent => {

    class Hoc extends React.Component{

        closePostMedia(){
            const {getSharedState, setSharedState} = this.props;
            const {open = false} = getSharedState();

            open && setSharedState({open: false});
        }

        openPostMedia(options){
            this.props.setSharedState({open: true});
        }

        isPostMediaOpen(){
            const {open = false} = this.props.getSharedState();
            return open;
        }

        render(){

            return (
              <WrappedComponent 
                {...this.props} 
                closePostMedia={this.closePostMedia.bind(this)}
                openPostMedia={this.openPostMedia.bind(this)}
                isPostMediaOpen={this.isPostMediaOpen.bind(this)}
              />);
        }

    }

    return withSharedState({namespace: ssNamespaces.postmedia})(Hoc);
}

export default withPostMedia;
