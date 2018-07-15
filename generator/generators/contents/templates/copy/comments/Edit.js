import React from 'react';
import {compose} from 'recompose';
import {withRouter} from "react-router-dom";
import withActions from 'wordpress-rest-admin/hoc/withActions';
import withHttp from 'wordpress-rest-admin/hoc/withHttp';
import {Field} from 'redux-form';
import Form from 'wordpress-rest-admin/components/Form';
import TextField from 'wordpress-rest-admin/components/forms/TextField';
import SelectField from 'wordpress-rest-admin/components/forms/SelectField';
import CommentField from 'wordpress-rest-admin/components/forms/CommentField';
import {SaveButton} from 'wordpress-rest-admin/components/ActionButton';
import withComment from 'wordpress-rest-admin/hoc/contents/withComment';
import wpUrl from 'wordpress-rest-admin/util/wpUrl';
import httpNormalizeResponseBody from 'wordpress-rest-admin/util/httpNormalizeResponseBody';

const textFields = edit => ([
    {id: 'author_name', label: 'Author\'s Name', defaultValue: edit.author_name},
    {id: 'author_email', label: 'Author\'s Email', defaultValue: edit.author_email},
    {id: 'author_url', label: 'Author\'s URL', defaultValue: edit.author_url},
]);

const commentStatus = [
    {label: 'Approved', value: 'approved'},
    {label: 'Pending', value: 'hold'},
    {label: 'Spam', value: 'spam'},
];

class Edit extends React.Component{

    componentWillMount(){

        const {comment, http, match: {params}} = this.props;

        const commentId = params.query;

        comment.bind(this, {commentId});

        http('_comment', {
            url: wpUrl().path(`comments/${commentId}`).query({context: 'edit'}).url,
            method: 'GET',
            isProtected: true
        });

    }

    render(){

        const {httpGetResponse} = this.props;

        var edit = {}

        try{
            edit = httpNormalizeResponseBody(httpGetResponse('_comment'))[0];
        }catch(err){
            return null;
        }

        return (<div>

           <Form form='_comment' onSubmit={values => this.comment.handleSubmit(values)} >

             {textFields(edit).map( (v,k) => {
                 return <Field component={TextField} key={k} id={v.id} name={v.id} label={v.label} defaultValue={v.defaultValue} />
             })}
    
             <Field 
               component={SelectField} 
               id='status' 
               name='status' 
               label='Status' 
               defaultValue={edit.status ? edit.status : 'pending'} 
               options={commentStatus} />

             <Field
               component={CommentField}
               id="content"
               name="content"
               label="Content"
               defaultValue={edit.content.raw}
             />

             <SaveButton style={{marginLeft: 0}} />
          </Form>
        </div>);
    }

}

export default compose(
    withRouter,
    withActions(),
    withComment({namespace: 'comment'}),
    withHttp(),
)(Edit);


