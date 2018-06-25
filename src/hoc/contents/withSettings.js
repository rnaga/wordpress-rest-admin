//import React from 'react';
//import PropTypes from 'prop-types';
import {compose} from 'recompose';
import Contents from './contents';
import withActions from '../withActions';
import wpUrl from '../../util/wpUrl';

const withSettings = ({namespace}) => WrappedComponent => {

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
 
            startAction();
    
            http('_submit', {
    
                url: wpUrl().path('settings').url, 
                method: 'POST',
                isProtected: true,
                options: {
                    payload: value
                },
                onSuccess: response => {
                    endAction({message: 'Successfully Updated'});
                }
            });
        }

    }

    return compose(withActions())(Hoc);
}

export default withSettings;


