import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class Checkboxes extends React.Component {

    constructor(props){
        super(props);
        this.state = {values: []};
        this.isChecked = this.isChecked.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        const {values} = this.props;
        this.setState({values});
    }

    handleChange(e){

        const {onInputChange, onChecked} = this.props;
        const value = onChecked 
                    ? onChecked(e.target.value) 
                    :e.target.value;

        var {values} = this.state;

        if(!e.target.checked)
            values.splice(values.indexOf(value), 1);
        else
            values.push(value);

        this.setState({values});

        if(typeof onInputChange === 'function' ) 
            onInputChange(values);
    };

    isChecked(value){

        const {isChecked} = this.props;
        const {values} = this.state;

        if(typeof isChecked === 'function')
            return isChecked(value);

        return Array.isArray(values) ? values.indexOf(value) >= 0 : false;
    }

    render() {
        const {items, label, isRow = false, style: _style = {}} = this.props;

        const style = Object.assign({}, {
            width: '98%',
            backgroundColor: '#fcfcfc', 
            padding: 10, 
            margin: '10px 0'}, _style);

        return (
        <FormControl component="fieldset" style={style}>
          <FormLabel component="legend">{label}</FormLabel>
          <FormGroup row={isRow}>
            {items.map( (item, i) => {

                const {label, value} = item;

                return (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      key={i}
                      checked={this.isChecked(value)}
                      onChange={this.handleChange.bind(this)}
                      value={typeof value !== 'string' ? value.toString() : value}
                    />
                   }
                   label={label}
                />)
            })}
        </FormGroup>
      </FormControl>);

  }
}

export default Checkboxes;

