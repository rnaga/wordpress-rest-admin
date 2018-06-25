import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class CheckboxField extends React.Component {

    constructor(props){
        super(props);
        this.state = {checked: false};
    }

    componentWillMount(){
        const {input, checked = false} = this.props;
        input.onChange(checked);

        this.setState({checked});
    }

    componentDidMount(){
        const {input, meta, onMount} = this.props;
        if(typeof onMount === 'function')
            onMount(input, meta);
    }

    handleChange(e){

        const checked = e.target.checked;

        const {input, onInputChange} = this.props;

        input.onChange(checked);

        if(typeof onInputChange === 'function')
            onInputChange(checked, input);

        this.setState({checked});
    }

    render() {

        const {checked} = this.state;
        const {label, style = {}} = this.props;

        return (
        <FormControlLabel
          label={label}
          style={style}
          control={
            <Checkbox 
              checked={checked}
              onChange={this.handleChange.bind(this)}
              style={style}
            />}
        />);
    }

}

export default CheckboxField;
