import React from 'react';

import ReactSelect from 'react-select';
import '../styles/react-select.css';

class Select extends React.Component{

    handleChange(value) {
        const {onChange} = this.props;

        if(typeof onChange === 'function')
            onChange(value);
    }

    render(){

        const {style: _style, 
               label, 
               options, 
               clearable = false, 
               defaultValue,
              } = this.props;

        const style = Object.assign({width: '50%'}, _style);

        return(
        <div style={style}>
        <label style={{fontSize: '0.775rem', color: 'rgba(0, 0, 0, 0.54)'}}>{label}</label>
        <ReactSelect
          options={options}
          simpleValue
          clearable={clearable}
          value={defaultValue}
          onChange={this.handleChange.bind(this)}
        /></div>)
    }
}

export default Select;

/*
import Select from 'material-ui/Select';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';

export default class extends React.Component{

    constructor(props){
        super(props);
        this.state = {value: props.defalutValue || ''};
    }

    handleChange(e){

        const {onChange} = this.props;

        const defaultHandleChange = e => this.setState({value: e.target.value});
         
        if(!onChange)
            return defaultHandleChange(e);

        onChange(e); 
        defaultHandleChange(e);
    }

    render(){

        const {options: items, label, style} = this.props;

        const menuItems = items.map((item, i) => {
            return (<MenuItem key={i} value={item.value}>{item.name}</MenuItem>);
        });

        return (<div>
            <FormControl style={style}>
              <InputLabel style={{width: 200}}>{label}</InputLabel>
              <Select
                onChange={this.handleChange.bind(this)} 
                value={this.state.value}
              >
              {menuItems}</Select>
            </FormControl></div>);
    }
}
*/
