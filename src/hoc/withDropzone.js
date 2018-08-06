import React from 'react';
import withSharedState, {ssNamespaces} from './withSharedState';

const withDropzone = options => WrappedComponent => {

    class Hoc extends React.Component{
    
        closeDropzone(){
            const {getSharedState, setSharedState} = this.props;
            const {open = false} = getSharedState();

            open && setSharedState({open: false});
        }

        openDropzone(options){
            this.props.setSharedState({open: true});
        }

        isDropzoneOpen(){
            const {open = false} = this.props.getSharedState();
            return open;
        }

        render(){
   
            return (
              <WrappedComponent 
                {...this.props} 
                openDropzone={this.openDropzone.bind(this)}
                closeDropzone={this.closeDropzone.bind(this)}
                isDropzoneOpen={this.isDropzoneOpen.bind(this)}
              />);
        }
    }

    return withSharedState({namespace: ssNamespaces.dropzone})(Hoc);

}

export default withDropzone;


