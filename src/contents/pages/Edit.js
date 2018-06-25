import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';
import withHttp from '../../hoc/withHttp';
import withForm from '../../hoc/withForm';
import withPage from '../../hoc/contents/withPage';
import Form from '../../components/Form';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';

import PostSettings, {
    PostSettingsStatus,
    PostSettingsStatusNoPublish,
    PostSettingsComments,
    PostSettingsMoreOptions,} from '../../components/posts/PostSettings';

import PostTitle from '../../components/posts/PostTitle';
import PostContent from '../../components/posts/PostContent';
import PostToolbar from '../../components/posts/PostToolbar';
import wpUrl from '../../util/wpUrl';
import {account} from '../../util/caches';

class Edit extends React.Component {

    componentWillMount(){

        const {
            http, 
            page, 
            history,
            _basePath,
            match: {params},
        } = this.props;

        this.pageId = params.query || null;
        this.handleDelete = this.handleDelete.bind(this);

        http('_pages', {
            url: wpUrl().path(`pages/${this.pageId}`).query({context: 'edit'}).url,
            method: 'GET',
            isProtected: true
        });
   
        page.bind(this, {
            pageId: this.pageId, 
            submitAfter: json => {
                history.replace(`${_basePath}/pages/Edit/${json.id}`);
            },
        }); 
    }

    handleDelete(e){
        const {history} = this.props;
        this.page.handleDelete({pageId: this.pageId, after: history.goBack});
    }

    render(){

        const {
          httpGetResponse, 
          formValues, 
          doSubmit, 
          getFormId} = this.props;

        var response = {};

        try{
            response = httpNormalizeResponseBody(httpGetResponse('_pages'))[0];
        }catch(err){
            return null;
        }

        const edit = Object.assign({}, response, formValues.values);

        return (<div>
          <Form form={getFormId()} onSubmit={this.page.handleSubmit} > 

            <PostToolbar 
              onDelete={this.handleDelete}
              onSubmit={doSubmit} 
              isCreate={false}/>

            <PostSettings> 
               {account.cap.publish_pages 
                 ? <PostSettingsStatus edit={edit} /> 
                 : <PostSettingsStatusNoPublish edit={edit} />}
               {account.cap.moderate_comments && 
                response.status.match(/^(publish|pending|private)$/) &&
               <PostSettingsComments edit={edit} />}
               <PostSettingsMoreOptions edit={edit} />
            </PostSettings>
           
            <PostTitle edit={edit} />
            <PostContent edit={edit} />

          </Form>
        </div>);
    }
}

Edit = compose(
    withRouter,
    withPage({namespace: 'page'}),
    withHttp(),
    connect(),
    withForm({id: '_pages'}),
)(Edit);

class Create extends React.Component {

    componentWillMount(){

        const {page, history, _basePath,} = this.props;

        page.bind(this, {
            submitAfter: json => {
                history.replace(`${_basePath}/pages/Edit/${json.id}`);
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
          <Form form={getFormId()} onSubmit={this.page.handleSubmit} >

            <PostToolbar onSubmit={doSubmit} isCreate={true}/>

            <PostSettings>
               <PostSettingsStatus  edit={edit} />
               <PostSettingsMoreOptions edit={edit} />
            </PostSettings>

            <PostTitle edit={edit} />
            <PostContent edit={edit} />

          </Form>
        </div>);
    }
}

Create = compose(
    withPage({namespace: 'page'}),
    withHttp(),
    connect(),
    withForm({id: '_create_page'}),
)(Create);

export {Create, Edit};


