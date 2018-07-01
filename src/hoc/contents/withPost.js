//import React from 'react';
//import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom'
import Contents from './contents';
import withActions from '../withActions';
import wpUrl from '../../util/wpUrl';
import caches from '../../util/caches';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';

const withPost = ({namespace}) => WrappedComponent => {

    class Hoc extends Contents{

        render(){
            return this._render({namespace, WrappedComponent});
        }

        bindComponent(component, _options){

            super.bindComponent(namespace, component, _options);

            component[namespace] = Object.assign(component[namespace], {
                handleSubmit: this.handleSubmit.bind(component),
                handleDelete: this.handleDelete.bind(component),
                submitTags: this.submitTags.bind(component),
                canEdit: this.canEdit.bind(component),
                canDelete: this.canDelete.bind(component),
            });
        }

        canEdit(item){

            const account = caches('account');

            switch(item.status){
                case 'publish':
                    return account.cap.edit_published_posts;
                case 'private':
                    return account.cap.edit_private_posts;
                default:
                    return account.cap.edit_posts;
            }
        }

        canDelete(item){

            const account = caches('account');

            switch(item.status){
                case 'publish':
                    return account.cap.delete_published_posts;
                case 'private':
                    return account.cap.delete_private_posts;
                default:
                    return account.cap.delete_posts;
            }
        }

        submitTags(tagsRaw){

            const {http} = this.props;

            return new Promise( (resolve, reject) => {

                if(!Array.isArray(tagsRaw)){
                    resolve(null); return
                }

                var tags = [], payloads = [];

                tagsRaw.forEach( tag => {
                    if(typeof tag.value === 'number')
                        tags.push(tag.value);
                    else
                        payloads.push({name: tag.value, slug: tag.value});
                });

                if(0 >= payloads.length){
                    resolve(tags); return;
                }

                http('_tags_submit', {
                    url: wpUrl().path('tags').url,
                    method: 'POST',
                    isProtected: true,
                    options: {
                        payload: payloads
                    },
                    onSuccess: response => {
                        const arr = httpNormalizeResponseBody({response});
                        arr.forEach( newTag => {
                            tags.push(newTag.id);
                        });
  
                        resolve(tags);
                    },
                    onFail: err => {
                        reject(err);
                    }
                });
            });
        }

        async handleSubmit(value){
 
            const {
                http, 
                startAction, 
                endAction,} = this.props;

            const {submitTags, _options} = this[namespace];
            const {postId, submitAfter} = _options;

            startAction();
  
            // Set Tags first
            var {tagsRaw, submit_for_review: submitForReview, ...payload} = value;

            const tags = await submitTags(tagsRaw);

            if(Array.isArray(tags))
                payload['tags'] = tags;

            if(submitForReview === true)
                payload['status'] = 'pending';
            
            if(submitForReview === false)
                payload['status'] = 'draft';

            http('_submit', {
                url: wpUrl().path(`posts/${postId || ''}`).url,
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

        handleDelete({postId, after = (() => {})}){
   
            const {http, startAction, endAction, confirmAction} = this.props;
 
            const httpDelete = () => {
    
                startAction();
  
                http('_delete', {
                    url: wpUrl().path(`posts/${postId}`).url,
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
                message: 'Are you sure you want to delete this post?'});
        }

    }

    return compose(
        withActions(),
        withRouter,
    )(Hoc);
}

export default withPost;


