import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class SwitchField extends React.Component {

    constructor(props){
        super(props);

        const {defaultValue = false} = this.props;

        this.state = {
            checked: defaultValue,
        }
    }

    componentWillMount(){

        const {input, defaultValue} = this.props;

        var checked = input.value ? input.value : defaultValue;

        if(defaultValue && !input.value){
            input.onChange(defaultValue);
        }

        this.setState({checked});
    }

    componentDidMount(){
        const {input, meta, onMount} = this.props;
        if(typeof onMount === 'function')
            onMount(input, meta);
    }

    handleChange(e){
        const {input, onInputChange} = this.props;
        const checked = !this.state.checked;

        input.onChange(checked);
        this.setState({checked});

        if(typeof onInputChange === 'function')
            onInputChange(checked, input);
    }

    render(){
        const {style: _style, label} = this.props;

        const style = Object.assign({paddingBottom: 10}, _style);

        return (<div style={style}>
        <FormControlLabel
          control={
          <Switch
            checked={this.state.checked}
            onChange={this.handleChange.bind(this)}
            value="checkedB"
            color="primary"
          />
          }
          label={label}
         />
         </div>);
    }
}

export default SwitchField;

