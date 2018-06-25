//import React from 'react';
//import PropTypes from 'prop-types';
import {compose} from 'recompose';
import Contents from './contents';
import withActions from '../withActions';
import wpUrl from '../../util/wpUrl';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';

const withProfile = ({namespace}) => WrappedComponent => {

    class Hoc extends Contents{

        render(){
            return this._render({namespace, WrappedComponent});
        }

        bindComponent(component, _options){

            super.bindComponent(namespace, component, _options);

            component[namespace] = Object.assign(component[namespace], {
                handleSubmit: this.handleSubmit.bind(component),
            });
        }

        handleSubmit(value){

            const {startAction, endAction, http} = this.props;
            const {submitAfter} = this[namespace]._options;

            startAction();
    
            http('_submit', {
    
                url: wpUrl().path('users/me').url, 
                method: 'POST',
                isProtected: true,
                options: {
                    payload: value
                },
                onSuccess: response => {
                    const arr = httpNormalizeResponseBody({response});
                    submitAfter && submitAfter(arr[0], response);
                    endAction({message: 'Successfully Updated'});
                }
            });
        }
    }

    return compose(withActions())(Hoc);
}

export default withProfile;

