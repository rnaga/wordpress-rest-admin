import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form'
import {compose} from 'recompose';
import {actions} from '../actions';

class Form extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            formKey: Math.random()
        }
    }

    componentDidMount(){
        const {onMount} = this.props;
        if(typeof onMount === 'function')
            onMount(this.props, {resetForm: this.resetForm.bind(this)});
    }

    resetForm(){
        const {dispatch, form: id} = this.props;

        this.props.reset();
        dispatch(actions.setFormValues(id, {}));
        this.setState({formKey: Math.random()});
    }

    render(){

        const {form: formId, 
               handleSubmit, 
               children, 
               onSubmit} = this.props;

        return (
        <form 
          key={this.state.formKey}
          ref={e => this._formRef = e}        
          form={formId} 
          onSubmit={handleSubmit(onSubmit)}>
          {children}
        </form>);
    }
} 

export default compose(
  connect(),
  reduxForm({
      onChange: (values, dispatch, props) => {
          const {form: id} = props;
          dispatch(actions.setFormValues(id, values));
      },
  }),
)(Form);


