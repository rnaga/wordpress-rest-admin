import React from 'react';
import withSharedState, {ssNamespaces} from './withSharedState';

const withActions = options => WrappedComponent => {

    class Hoc extends React.Component{

        startAction(){
            const {setSharedState} = this.props;
            setSharedState({open: true}, ssNamespaces.loading);
        }

        endAction({message}){
            const {setSharedState} = this.props;
         
            setSharedState({open: false}, ssNamespaces.loading);
            setSharedState({open: true, message}, ssNamespaces.snackbar);
        }

        confirmAction({onYes, onNo, message}){

            const {setSharedState} = this.props;

            const _onYes = () => { 
                if(typeof onYes === 'function') 
                    onYes();
            }

            const _onNo = () => { 
                if(typeof onNo === 'function') 
                    onNo();
            }

            setSharedState({
                open: true,
                message,
                onNo: _onNo,
                onYes: _onYes,
            }, ssNamespaces.confirm);
          
        }

        render(){

            return (
              <WrappedComponent 
                {...this.props} 
                startAction={this.startAction.bind(this)}
                endAction={this.endAction.bind(this)}
                confirmAction={this.confirmAction.bind(this)}
              />);
        }

    }

    return withSharedState()(Hoc);
}

export default withActions;
