import React from 'react';
import withSharedState, {ssNamespaces} from './withSharedState';

const withDialogForm = options => WrappedComponent => {

    class Hoc extends React.Component{

        componentWillUnmount(){
            this.props.setSharedState({open: false});
        }

        closeDialogForm(){
            this.props.setSharedState({open: false});
        }

        openDialogForm(options){
            this.props.setSharedState({...options, open: true});
        }

        render(){

            return (
              <WrappedComponent 
                {...this.props} 
                openDialogForm={this.openDialogForm.bind(this)}
                closeDialogForm={this.closeDialogForm.bind(this)}
              />);
        }

    }

    return withSharedState({namespace: ssNamespaces.dialogform})(Hoc);
}

export default withDialogForm;
