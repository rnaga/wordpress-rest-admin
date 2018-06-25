import React from 'react';
import {compose} from 'recompose';
import AsyncSelect from '../AsyncSelect';
import withStyles from '../../hoc/withStyles';

class AsyncSelectField extends React.Component {

    componentWillMount(){
        const {input, defaultValue} = this.props;

        if(defaultValue && !input.value){
            input.onChange(defaultValue);
        }
    }

    componentDidMount(){
        const {input, meta, onMount} = this.props;
        if(typeof onMount === 'function')
            onMount(input, meta);
    }

    render(){
        const {input, 
               defaultValue, 
               id, 
               name, 
               label, 
               isEdit, 
               fullWidth = false,
               style: _style = {},
               onChange,
               asyncInputChange,
               asyncDefaultOptions,
               multi = false,
               creatable = false} = this.props;

        const style = Object.assign({width: fullWidth ? '100%' : '80%', paddingBottom: 10}, _style); 

        if(isEdit && !defaultValue)
            return null;

        return (<div style={{paddingTop: 10}}>
          <AsyncSelect
            id={id}
            name={name}
            label={label}
            style={style}
            multi={multi}
            creatable={creatable}
            defaultValue={defaultValue}
            onChange={value => {
                if(onChange) onChange(value);
                input.onChange(value);
            }}
            asyncInputChange={asyncInputChange}
            asyncDefaultOptions={asyncDefaultOptions}
          />
        </div>);
    }
}

export default compose(withStyles)(AsyncSelectField);
