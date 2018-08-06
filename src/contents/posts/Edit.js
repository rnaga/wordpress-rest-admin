import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';
import withHttp from '../../hoc/withHttp';
import withForm from '../../hoc/withForm';
import withPost from '../../hoc/contents/withPost';
import Form from '../../components/Form';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';

import PostSettings, {
    PostSettingsStatus,
    PostSettingsStatusNoPublish,
    PostSettingsCategoriesAndTags,
    PostSettingsFormat,
    PostSettingsComments,
    PostSettingsMoreOptions,} from '../../components/posts/PostSettings';

import PostMedia from '../../components/posts/PostMedia';
import PostTitle from '../../components/posts/PostTitle';
import PostContent from '../../components/posts/PostContent';
import PostToolbar from '../../components/posts/PostToolbar';
import wpUrl from '../../util/wpUrl';
import caches from '../../util/caches';

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

