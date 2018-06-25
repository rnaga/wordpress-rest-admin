import React from 'react';
import {compose} from 'recompose';
import {withRouter} from "react-router-dom";
import withActions from '../../hoc/withActions';
import withHttp from '../../hoc/withHttp';
import {Field} from 'redux-form';
import Form from '../../components/Form';
import {Get, Success} from '../../containers/http';
import TextField from '../../components/forms/TextField';
import SelectField from '../../components/forms/SelectField';
import CommentField from '../../components/forms/CommentField';
import {SaveButton} from '../../components/ActionButton';
import withComment from '../../hoc/contents/withComment';
import wpUrl from '../../util/wpUrl';

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

class Create extends React.Component{

    componentWillMount(){
        const {comment, commentId} = this.props;
        comment.bind(this, {commentId});
    }

    render(){

        const {edit: _edit} = this.props;
        const edit = _edit ? _edit[0] : {}

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

Create = compose(
    withRouter,
    withActions(), 
    withComment({namespace: 'comment'}),
    withHttp(),
)(Create);

const Edit = props => {
    const {match: {params}} = props;

    const url = wpUrl().path(`comments/${params.query}`).query({context: 'edit'}).url;
    return (
      <Get url={url} bindProp='edit' isProtected>
        <Success>
          <Create {...props} commentId={params.query} />
        </Success>
      </Get>
    );
}

export {Edit, Create};





