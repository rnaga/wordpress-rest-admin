import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

class Radios extends React.Component{

    constructor(props){
        super(props);
        this.state = {value: null};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){

        const {onChange} = this.props;
        this.setState({value: e.target.value });

        if(onChange)
            onChange(e.target.value);
    }

    componentWillMount(){
        const {defaultValue = null} = this.props;
        this.setState({value: defaultValue });
    }

    render(){
        const {items, isRow = false} = this.props;
        const {value: stateValue} = this.state;

        return (
        <FormControl component="fieldset" style={{width: '98%',backgroundColor: '#fcfcfc', padding: 10, margin: '10px 0'}}>
{/*
          <FormLabel component="legend">{label}</FormLabel>
*/}
          <FormGroup row={isRow}>
          {items.map( (item,i) => {
              const {label, value} = item;

              return (
              <FormControlLabel
                key={i}
                control={
                  <Radio
                    key={i}
                    checked={stateValue === value}
                    onChange={this.handleChange}
                    value={value}
                    name={`radio-button-${label}`}
                    aria-label={label}
                  />}
                label={label}
              />)
          })}
        </FormGroup>
      </FormControl>);
    }
}

export default Radios;
