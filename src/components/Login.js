import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {Field} from 'redux-form';
import withStyles from '../hoc/withStyles';
import withForm from '../hoc/withForm';
import withAuth from '../hoc/withAuth';
import withAdmin from '../hoc/withAdmin';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
//import logo from '../WordpressLogo.svg';
import Form from './Form';
import TextField from './forms/TextField'
import ActionButton from './ActionButton';
import CheckboxField from './forms/CheckboxField';
import caches from '../util/caches';

class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            errMsg: null,
        }
    }

    handleSubmit(values){

        const {logIn, initAdmin} = this.props;
        const _self = this;
        const wpBaseUrl = caches('wpBaseUrl');

        wpBaseUrl.update(values.siteurl);
 
        logIn({...values})
          .then( results => {
              initAdmin();
          })
          .catch( err => {
              console.warn(err);
              try{
                  const returnValue = err.getReturnValue();
                  _self.setState({errMsg: returnValue.body.code});
              }catch(err){
                  console.warn(err);
                  _self.setState({errMsg: 'Login Failed'});  
              } 
          });
    } 

    render(){

        const {errMsg} = this.state;
        const wpBaseUrl = caches('wpBaseUrl');
        const {loginLogo} = this.context.staticFiles;

        return (
          <Dialog
            fullScreen
            open={true}
          >
            <DialogContent style={{backgroundColor: '#f1f1f1'}}>

              <div style={{
                boxSizing: 'border-box',
                margin: '50px auto 0',
                width: 320,
                display: 'flex',
                justifyContent: 'center'
              }}>

                <Typography variant="title" color="inherit" noWrap>
                  <img src={loginLogo} style={{width: '80px', height: '80px', paddingBottom: 20}} alt='wp-logo'/>
                </Typography>
              </div>

              {errMsg &&
              <div style={{
                boxSizing: 'border-box',
                margin: '0px auto 15px',
                width: 320,
                padding: '10px 20px',
                backgroundColor: 'white',
                borderLeft: '4px solid red',
                fontSize: '0.8rem',
              }}>
                <span style={{fontWeight: 600}}>ERROR:</span> {errMsg}
              </div>}

              <div style={{
                boxSizing: 'border-box',
                margin: 'auto', 
                width: 320,
                padding: '10px 20px', 
                backgroundColor: 'white', 
              }}>

                <Form form='_login' onSubmit={this.handleSubmit.bind(this)}>

                  <Field
                    component={TextField}
                    style={{width: '100%'}}
                    key='siteurl'
                    id='siteurl'
                    name='siteurl'
                    label='Site URL' 
                    defaultValue={wpBaseUrl.get()}
                    placeholder='e.g. http://localhost/wordpress'
                   />

                  <Field 
                    component={TextField} 
                    style={{width: '100%'}}
                    key='username' 
                    id='username' 
                    name='username' 
                    label='Username' />

                  <Field
                    component={TextField}
                    type='password'
                    style={{width: '100%'}}
                    key='password'
                    id='password'
                    name='password'
                    label='Password' />

                  <div style={{width: '100%', height: 60, paddingTop: 10}}>

                    <Field
                      component={CheckboxField}
                      style={{backgroundColor: 'inherit'}}
                      key='remember'
                      id='remember'
                      name='remember'
                      label='Remember Me'
                    />
                    
                    <ActionButton
                      style={{float: 'right', margin: '0'}}
                      label='Log In'
//                      onClick={doSubmit}
                    />
                  </div>

                </Form>
             
              </div>
            </DialogContent>
          </Dialog>);
    }
}

Login.contextTypes = {
    staticFiles: PropTypes.object,
};

export default compose(
   withStyles,
   withForm({id: '_login'}),
   withAuth({passAuth: true}),
   withAdmin,
)(Login);
