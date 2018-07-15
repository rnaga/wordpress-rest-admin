import React from 'react';
import {compose} from 'recompose';
import {withRouter} from "react-router-dom";
import withActions from 'wordpress-rest-admin/hoc/withActions';
import withHttp from 'wordpress-rest-admin/hoc/withHttp';
import httpNormalizeResponseBody from 'wordpress-rest-admin/util/httpNormalizeResponseBody';
import {Field} from 'redux-form';
import Form from 'wordpress-rest-admin/components/Form';
import TextField from 'wordpress-rest-admin/components/forms/TextField';
import SelectField from 'wordpress-rest-admin/components/forms/SelectField';
import {SaveButton, DeleteButton} from 'wordpress-rest-admin/components/ActionButton';
import withUser from 'wordpress-rest-admin/hoc/contents/withUser';
import withContentToolbar from 'wordpress-rest-admin/hoc/withContentToolbar';
import wpUrl from 'wordpress-rest-admin/util/wpUrl';

const textFields = edit => ([
    {id: 'first_name', label: 'First Name', defaultValue: edit.first_name},
    {id: 'last_name', label: 'Last Name', defaultValue: edit.last_name},
    {id: 'nickname', label: 'Nickname', defaultValue: edit.nickname},
    {id: 'email', label: 'email', defaultValue: edit.email},
]);

const roleItems = [
    {label: 'Subscriber', value: 'subscriber'},
    {label: 'Editor', value: 'editor'},
    {label: 'Contributor', value: 'contributor'},
    {label: 'Author', value: 'author'},
    {label: 'Administrator', value: 'administrator'},
];

class Edit extends React.Component{

    componentWillMount(){

        const {http, user, match: {params}} = this.props;
        const userId = params.query;

        user.bind(this, {userId});

        const _self = this;

        http('_users', {
            url: wpUrl().path(`users/${userId}`).query({context: 'edit'}).url,
            method: 'GET',
            isProtected: true,
            onSuccess: response => {
                const user = httpNormalizeResponseBody({response})[0];
                _self.updateToolbar(user.name);
            }
        });
    }

    handleDelete(e){
        const {userId, history} = this.props;
        this.user.renderDeleteForm({userId, after: history.goBack});
    }

    updateToolbar(value){
        const {setContentToolbar} = this.props;
        setContentToolbar({element: (<span style={{paddingLeft: 10}}>{value}</span>)});
    }

    render(){

        const {httpGetResponse} = this.props;

        var edit = {}

        try{
            edit = httpNormalizeResponseBody(httpGetResponse('_users'))[0];
        }catch(err){
            return null;
        }
    
        return (<div>

           <Form form='_users' onSubmit={this.user.handleSubmit}>

             {textFields(edit).map( (v,k) => {
                 return (<Field 
                   component={TextField} 
                   key={k} 
                   id={v.id} 
                   name={v.id} 
                   label={v.label} 
                   defaultValue={v.defaultValue} 
                 />);
             })}
   
             <Field
               component={TextField}
               id='name'
               name='name'
               label='Display Name'
               defaultValue={edit.name}
               onInputChange={value => this.updateToolbar(value)}
             />
 
             <Field 
               component={SelectField} 
               id='roles' 
               name='roles' 
               label='Role' 
               defaultValue={edit.roles ? edit.roles[0] : 'subscriber'} 
               options={roleItems} />

              <SaveButton style={{marginLeft: 0}} />
              <DeleteButton  onClick={this.handleDelete.bind(this)} style={{marginLeft: 20}}/>
          </Form>
          <div style={{height: 100}} />
        </div>);
    }

}

export default compose(
    withRouter,
    withActions(), 
    withUser({namespace: 'user'}),
    withHttp(),
    withContentToolbar,
)(Edit);


