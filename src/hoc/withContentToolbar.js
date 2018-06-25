import React from 'react';
import {compose} from 'recompose';
import withSharedState, {ssNamespaces} from './withSharedState';

const withContentToolbar = WrappedComponent => {

    class Hoc extends React.Component{

        setContentToolbar(options){
            this.props.setSharedState(options);
        }

        render(){
            return (<WrappedComponent 
              {...this.props} 
              setContentToolbar={this.setContentToolbar.bind(this)} 
            />);
        }
    }

    return compose(
        withSharedState({namespace: ssNamespaces.contenttoolbar}),
    )(Hoc);
}

export default withContentToolbar;
