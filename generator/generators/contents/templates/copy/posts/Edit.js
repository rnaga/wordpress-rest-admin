import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';
import withHttp from 'wordpress-rest-admin/hoc/withHttp';
import withForm from 'wordpress-rest-admin/hoc/withForm';
import withPost from 'wordpress-rest-admin/hoc/contents/withPost';
import Form from 'wordpress-rest-admin/components/Form';
import httpNormalizeResponseBody from 'wordpress-rest-admin/util/httpNormalizeResponseBody';

import PostSettings, {
    PostSettingsStatus,
    PostSettingsStatusNoPublish,
    PostSettingsCategoriesAndTags,
    PostSettingsFormat,
    PostSettingsComments,
    PostSettingsMoreOptions,} from 'wordpress-rest-admin/components/posts/PostSettings';

import PostMedia from 'wordpress-rest-admin/components/posts/PostMedia';
import PostTitle from 'wordpress-rest-admin/components/posts/PostTitle';
import PostContent from 'wordpress-rest-admin/components/posts/PostContent';
import PostToolbar from 'wordpress-rest-admin/components/posts/PostToolbar';
import wpUrl from 'wordpress-rest-admin/util/wpUrl';
import caches from 'wordpress-rest-admin/util/caches';

class Edit extends React.Component {

    componentWillMount(){

        const {
            http, 
            post, 
            history,
            _basePath,
            match: {params},
        } = this.props;

        this.postId = params.query || null;
        this.handleDelete = this.handleDelete.bind(this);

        http('_posts', {
            url: wpUrl().path(`posts/${this.postId}`).query({context: 'edit'}).url,
            method: 'GET',
            isProtected: true
        });
   
        post.bind(this, {
            postId: this.postId, 
            submitAfter: json => {
                history.replace(`${_basePath}/posts/Edit/${json.id}`);
            },
        }); 
    }

    handleDelete(e){
        const {history} = this.props;
        this.post.handleDelete({postId: this.postId, after: history.goBack});
    }

    render(){

        const account = caches('account');

        const {
          httpGetResponse, 
          formValues, 
          doSubmit, 
          getFormId} = this.props;

        var response = {};

        try{
            response = httpNormalizeResponseBody(httpGetResponse('_posts'))[0];
        }catch(err){
            return null;
        }

        const edit = Object.assign({}, response, formValues.values);

        return (<div>
          <Form form={getFormId()} onSubmit={this.post.handleSubmit} > 

            <PostToolbar 
              onDelete={this.handleDelete}
              onSubmit={doSubmit} 
              isCreate={false}/>

            <PostSettings> 
               {account.cap.publish_posts 
                 ? <PostSettingsStatus edit={edit} /> 
                 : <PostSettingsStatusNoPublish edit={edit} />}
               <PostSettingsCategoriesAndTags edit={edit} />
               <PostSettingsFormat edit={edit} />
               {account.cap.moderate_comments && 
                response.status.match(/^(publish|pending|private)$/) &&
               <PostSettingsComments edit={edit} />}
               <PostSettingsMoreOptions edit={edit} />
            </PostSettings>
           
            <PostMedia edit={edit} />
            <PostTitle edit={edit} />
            <PostContent edit={edit} />

          </Form>
        </div>);
    }
}

export default compose(
    withRouter,
    withPost({namespace: 'post'}),
    withHttp(),
    connect(),
    withForm({id: '_posts'}),
)(Edit);

