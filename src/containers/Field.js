import React from 'react';
import PropTypes from 'prop-types';
import {Field as ReduxField} from 'redux-form';
import withPropsFilter from '../hoc/withPropsFilter';

const render = withPropsFilter({filterBindProp: '_filtered'})(props => {

    const {fieldComponent: FieldComponent, fieldProps, _filtered} = props;
    const {component, filter, ...rest} = fieldProps;

    const random = Math.random();

    return (<FieldComponent {...rest} {..._filtered} defaultValue={random} />)
});

class Field extends React.Component {

    render(){

        const {name, id, label, component} = this.props;
        return (
          <ReduxField 
            {...this.props}
            fieldProps={this.props}
            name={name||id} 
            label={label} 
            fieldComponent={component} 
            component={render} 
            />);
    }
}

Field.propTypes = {
    component: PropTypes.func.isRequired
}

export default Field;

