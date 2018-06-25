import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import withSharedState, {ssNamespaces} from './withSharedState';

const withErrorbar = WrappedComponent => {

    class Hoc extends React.Component{

        

        render(){
            return <WrappedComponent {...this.props} />;
        }
    }

    return compose(
        withSharedState({namespace: ssNamespaces.errorbar})
    )(Hoc);
}

export default withErrorbar;
