import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {actions} from '../actions';

const ssNamespaces = {
    sidebar: 'sidebar',
    sidebaritem: 'sidebaritem',
    loading: 'loading',
    confirm: 'confirm',
    snackbar: 'snackbar',     
    errorbar: 'errorbar',
    useraccount: 'useraccount',
    postsettings: 'postsettings',
    postmedia: 'postmedia',
    contenttoolbar: 'contenttoolbar',
    dialogform: 'dialogform',
    width: 'width',
    media: 'media',
    dropzone: 'dropzone',
};

export {ssNamespaces};

const withSharedState = (options = {}) => WrappedComponent => {

    const {namespace: gNamespace} = options;

    class Hoc extends React.Component{
    
        constructor(props){
            super(props);
            this.setSharedState = this.setSharedState.bind(this);
            this.getSharedState = this.getSharedState.bind(this);
        }

        setSharedState(value, _namespace){

            const namespace = _namespace || gNamespace;

            if(!namespace)
                throw Error('SharedState.set: namespace undefined');

            const {dispatch} = this.props;
            dispatch(actions.setSharedState(namespace, value));
        }

        getSharedState(options = {}){

            const {defaultValue = {}} = options;
            const namespace = options.namespace || gNamespace;

            if(!namespace)
                throw Error('SharedState.get: namespace undefined');

            const {store} = this.context;
            const state = store.getState().sharedState[namespace];

            return !state ? defaultValue : state;

        }

        render(){

            const {sharedState, ...rest} = this.props;

            return (
              <WrappedComponent 
                {...rest} 
                ownSharedState={sharedState}
                getSharedState={this.getSharedState}
                setSharedState={this.setSharedState} 
              />);
        }
    } 

    Hoc.contextTypes = {
        store: PropTypes.object
    };

    const mapStateToProps = (state, ownProps) => {

        const namespace = gNamespace || ownProps.sharedStateKey;

        const sharedState = namespace
                          ? state.sharedState[namespace] 
                          : state.sharedState;

        return {sharedState};
    }

    return compose(
        connect(mapStateToProps),
    )(Hoc);

}

export default withSharedState;


