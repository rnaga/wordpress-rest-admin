import React from 'react';
import {connect} from 'react-redux';
import {submit} from 'redux-form';
import {compose} from 'recompose';
import {actions} from '../actions';

const withForm = options => WrappedComponent => {

    const getFormId = props => {
        return props.id || options.id;
    }

    class Hoc extends React.Component{
    
        setFormValues(id, values){
            const {dispatch} = this.props;
            dispatch(actions.setFormValues(id, values));
        }

        clearFormValues(){
            const {dispatch} = this.props;
            const formId = getFormId(this.props);
            dispatch(actions.clearFormValues(formId));
        }

        doSubmit(){
            const {dispatch} = this.props;
            const formId = getFormId(this.props);
            dispatch(submit(formId));
        }

        componentWillUnmount(){
            this.clearFormValues();
        }

        render(){
   
            const {formValues = {}} = this.props;

            return (
              <WrappedComponent 
                {...this.props} 
                formValues={formValues} 
                setFormValues={this.setFormValues.bind(this)}
                clearFormValues={this.clearFormValues.bind(this)}
                getFormId={() => getFormId(this.props)}
                doSubmit={this.doSubmit.bind(this)}
              />);
        }
    }

    const mapStateToProps = (state, ownProps) => {
        const formId = getFormId(ownProps); 
        return {formValues: state.formValues[formId],}
    };

    return compose(
        connect(mapStateToProps),
    )(Hoc);

}

export default withForm;


