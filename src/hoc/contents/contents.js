import React from 'react';
import PropTypes from 'prop-types';

class Contents extends React.Component{

    constructor(props){
        super(props);
        this.bindComponent = this.bindComponent.bind(this);

    }

    _render({namespace, WrappedComponent}){

        const bind = {
            [namespace]: {
                bind: this.bindComponent,
            }
        };

        return (
          <WrappedComponent
            {...this.props}
            {...bind}
          />);
    }

    bindComponent(namespace, component, _options = {}){

        component[namespace] = {
            _options,
            _location: this.context.location,
            _history: this.context.history,
            _store: this.context.store,
        }

        component.__ref_content__ = component[namespace];
    }
}

Contents.contextTypes = {
    store: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
};


export default Contents;

