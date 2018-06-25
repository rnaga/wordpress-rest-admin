import React from 'react';
//import PropTypes from 'prop-types';
import {Field} from 'redux-form';
import {compose} from 'recompose';
import Contents from './contents';
import withActions from '../withActions';
import withDialogForm from '../../hoc/withDialogForm';
import AsyncSelectField from '../../components/forms/AsyncSelectField';
import wpUrl from '../../util/wpUrl';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import ActionButton, {CancelButton} from '../../components/ActionButton';

const withUser = ({namespace}) => WrappedComponent => {

    class Hoc extends Contents{

        render(){
            return this._render({namespace, WrappedComponent});
        }

        bindComponent(component, _options){

            super.bindComponent(namespace, component, _options);

            const {openDialogForm, closeDialogForm} = this.props;

            component[namespace] = Object.assign(component[namespace], {
                handleSubmit: this.handleSubmit.bind(component),
                handleDelete: this.handleDelete.bind(component),
                renderDeleteForm: this.renderDeleteForm.bind(component),
                openDialogForm,
                closeDialogForm,
            });
        }

        handleSubmit(value){

            const {startAction, endAction, http} = this.props;
            const {userId = '', submitAfter} = this[namespace]._options;

            startAction();
    
            http('_submit', {
    
                url: wpUrl().path(`users/${userId || ''}`).url, 
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

        renderDeleteForm({after}){

            const {handleDelete, openDialogForm, closeDialogForm} = this[namespace];
            const {http} = this.props;

            const asyncInputChange = (value = '') => {
                return new Promise((resolve, reject) => {
                    http('_user_delete_form', {
                        url: wpUrl().path('users').query({per_page: 100, context: 'edit', search: value}).url,
                        method: 'GET',
                        isProtected: true,
                        onSuccess: response => {
                            const body = httpNormalizeResponseBody({response});
                            const options = body.map( v => {
                                return {value: v.id, label: v.name};
                            });

                            resolve(options);
                        },
                        onFail: error => {
                            reject(error);
                        }
                    });
                });
            }

            const content = (<div>
               <Field
                 component={AsyncSelectField}
                 id='reassign'
                 name='reassignRaw'
                 label='Choose User to reassign Posts'
                 fullWidth
                 asyncInputChange={asyncInputChange}
                 asyncDefaultOptions={asyncInputChange}
               /><div style={{height: 50}} /></div>);

            openDialogForm({
                form: '_categories',
                onClose: closeDialogForm,
                onSubmit: value => {
                    handleDelete(value, () => {

                        closeDialogForm();

                        if(typeof after === 'function')
                            after();
                    })
                },
                content,
                title: 'Delete User',
                actionButtons: [
                    <ActionButton key='proceed' label='Proceed' />,
                    <CancelButton key='cancel' onClick={closeDialogForm} />
                ]
            });

        }

        handleDelete(value, after){

            const {http, startAction, endAction, confirmAction} = this.props;
            const {userId} = this[namespace]._options; 

            value.reassign = value.reassignRaw ? value.reassignRaw.value : '';
            value.force = true;

            const httpDelete = () => {
    
                startAction();
  
                http('_delete', {
                    url: wpUrl().path(`users/${userId}`).url,
                    method: 'DELETE',
                    isProtected: true,
                    options: {
                        payload: value
                    },
                    onSuccess: response => {
                        endAction({message: 'Successfully Deleted'});
                        if(typeof after === 'function')
                            after();
                    }
                });
            }

            confirmAction({
                onYes: httpDelete, 
                message: 'Are you sure you want to delete this user?'});
        }

    }

    return compose(withActions(),withDialogForm(),)(Hoc);
}

export default withUser;


