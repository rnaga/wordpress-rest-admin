import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import withHttp from '../../hoc/withHttp';
import withForm from '../../hoc/withForm';
import withPost from '../../hoc/contents/withPost';
import Form from '../../components/Form';

import PostSettings, {
    PostSettingsStatus,
    PostSettingsCategoriesAndTags,
    PostSettingsFormat,
    PostSettingsMoreOptions,} from '../../components/posts/PostSettings';

import PostTitle from '../../components/posts/PostTitle';
import PostContent from '../../components/posts/PostContent';
import PostToolbar from '../../components/posts/PostToolbar';

class Create extends React.Component {

    componentWillMount(){

        const {post, history, _basePath,} = this.props;

        post.bind(this, {
            submitAfter: json => {
                history.replace(`${_basePath}/posts/Edit/${json.id}`);
            },
        });

        this.initEdit = {
            status: 'draft',
            format: 'standard',
            categories: [],
            tags: []
        };

    }

    render(){ 
        const {
          formValues,
          doSubmit,
          getFormId} = this.props;

        const edit = Object.assign({}, this.initEdit, formValues.values);

        return (<div>
          <Form form={getFormId()} onSubmit={this.post.handleSubmit} >

            <PostToolbar onSubmit={doSubmit} isCreate={true}/>

            <PostSettings>
               <PostSettingsStatus  edit={edit} />
               <PostSettingsCategoriesAndTags  edit={edit} />
               <PostSettingsFormat edit={edit} />
               <PostSettingsMoreOptions edit={edit} />
            </PostSettings>

            <PostTitle edit={edit} />
            <PostContent edit={edit} />

          </Form>
        </div>);
    }
}

export default compose(
    withPost({namespace: 'post'}),
    withHttp(),
    connect(),
    withForm({id: '_create_post'}),
)(Create);



