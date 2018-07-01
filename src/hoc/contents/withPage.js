//import React from 'react';
//import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom'
import Contents from './contents';
import withActions from '../withActions';
import wpUrl from '../../util/wpUrl';
import caches from '../../util/caches';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';

const withPage = ({namespace}) => WrappedComponent => {

    class Hoc extends Contents{

        render(){
            return this._render({namespace, WrappedComponent});
        }

        bindComponent(component, _options){

            super.bindComponent(namespace, component, _options);

            component[namespace] = Object.assign(component[namespace], {
                handleSubmit: this.handleSubmit.bind(component),
                handleDelete: this.handleDelete.bind(component),
                canEdit: this.canEdit.bind(component),
                canDelete: this.canDelete.bind(component),
            });
        }

        canEdit(item){

            const account = caches('account');
 
            switch(item.status){
                case 'publish':
                    return account.cap.edit_published_pages;
                case 'private':
                    return account.cap.edit_private_pages;
                default:
                    return account.cap.edit_pages;
            }
        }

        canDelete(item){

            const account = caches('account');

            switch(item.status){
                case 'publish':
                    return account.cap.delete_published_pages;
                case 'private':
                    return account.cap.delete_private_pages;
                default:
                    return account.cap.delete_pages;
            }
        }

        handleSubmit(value){
 
            const {
                http, 
                startAction, 
                endAction,} = this.props;

            const {_options} = this[namespace];
            const {pageId, submitAfter} = _options;

            startAction();
 
            var {submit_for_review: submitForReview, ...payload} = value;
 
            if(submitForReview === true)
                payload['status'] = 'pending';
            
            if(submitForReview === false)
                payload['status'] = 'draft';

            http('_submit', {
                url: wpUrl().path(`pages/${pageId || ''}`).url,
                method: 'POST',
                isProtected: true,
                options: {
                    payload,
                },
                onSuccess: response => {
                    const arr = httpNormalizeResponseBody({response});
                    submitAfter && submitAfter(arr[0], response);
                    endAction({message: 'Successfully Updated'});
                }
            });
        }

        handleDelete({pageId, after = (() => {})}){
   
            const {http, startAction, endAction, confirmAction} = this.props;
 
            const httpDelete = () => {
    
                startAction();
  
                http('_delete', {
                    url: wpUrl().path(`pages/${pageId}`).url,
                    method: 'DELETE',
                    isProtected: true,
                    onSuccess: response => {
                        endAction({message: 'Successfully Deleted'});
                        after();
                    }
                });
            }

            confirmAction({
                onYes: httpDelete, 
                message: 'Are you sure you want to delete this page?'});
        }

    }

    return compose(
        withActions(),
        withRouter,
    )(Hoc);
}

export default withPage;


