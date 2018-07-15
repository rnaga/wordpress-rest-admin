import React from 'react';
import {compose} from 'recompose';
import {withRouter} from "react-router-dom";
import withActions from '../../hoc/withActions';
import withHttp from '../../hoc/withHttp';
import {Field} from 'redux-form';
import Form from '../../components/Form';
import TextField from '../../components/forms/TextField';
import SelectField from '../../components/forms/SelectField';
import {SaveButton} from '../../components/ActionButton';
import withUser from '../../hoc/contents/withUser';

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

class Create  extends React.Component{

    componentWillMount(){

        const {
            user,
            history,
            _basePath,} = this.props;

        user.bind(this, {submitAfter: json => {
            history.replace(`${_basePath}/users/Edit/${json.id}`);
        }});
    }

    render(){

        return (<div>

           <Form form='_create_user' onSubmit={this.user.handleSubmit} >

             <Field 
               component={TextField} 
               id='username' 
               name='username' 
               label='Username' 
             />

             <Field
               component={TextField}
               type='password'
               id='password'
               name='password'
               label='Password'
             />

             {textFields({}).map( (v,k) => {
                 return <Field component={TextField} key={k} id={v.id} name={v.id} label={v.label} defaultValue={v.defaultValue} />
             })}

             <Field
               component={SelectField}
               id='roles'
               name='roles'
               label='Role'
               defaultValue={'subscriber'}
               options={roleItems} />

              <SaveButton style={{marginLeft: 0}} />

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
)(Create);



