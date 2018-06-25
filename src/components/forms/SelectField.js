import React from 'react';
import Select from '../../components/Select';

class SelectField extends React.Component {

    constructor(props){
        super(props);

        this.forwardChange = true;
        this.state = {value: null};

        if(typeof this.props.onInputChange !== 'function')
            this.forwardChange = false;
    }

    componentWillMount(){
        const {input, defaultValue} = this.props;

        if(defaultValue && !input.value)
            input.onChange(defaultValue);

        if(!this.forwardChange)
            this.setState({value: defaultValue});
    }

    componentDidMount(){
        const {input, meta, onMount} = this.props;
        if(typeof onMount === 'function')
            onMount(input, meta);
    }

    handleChange(value){

        const {input, onInputChange} = this.props;

        input.onChange(value);

        if(this.forwardChange)
            onInputChange(value, input);
        else
            this.setState({value});
    }

    render(){
        const {input, 
               defaultValue: _defaultValue, 
               id, 
               label, 
               fullWidth = false,
               items, 
               onInputChange, 
               style: _style, 
               styleDiv: _styleDiv, 
               ...rest} = this.props;

        const style = Object.assign({width: fullWidth ? '100%' : '50%', paddingBottom: 10}, _style);
        const styleDiv = Object.assign({paddingTop: 10}, _styleDiv);

        const defaultValue = this.forwardChange ? _defaultValue : this.state.value;

        return (<div style={styleDiv}>
          <Select
            {...rest}
            style={style}
            name={id}
            id={id}
            label={label}
            defaultValue={defaultValue}
            onChange={this.handleChange.bind(this)}
            items={items}
            />
         </div>);
    }
}

export default SelectField;

