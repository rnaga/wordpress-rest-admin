import React from 'react';
import Radios from '../Radios';

class RadiosField extends React.Component {

    componentWillMount(){
        const {input, defaultValue} = this.props;

        if(defaultValue && !input.value)
            input.onChange(defaultValue);
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
               label, 
               items, 
               onInputChange, 
               style: _style, 
               styleDiv: _styleDiv, 
               ...rest} = this.props;

        const style = Object.assign({paddingBottom: 10}, _style);
        const styleDiv = Object.assign({paddingTop: 10}, _styleDiv);

        return (<div style={styleDiv}>
          <Radios
            {...rest}
            style={style}
            name={id}
            id={id}
            label={label}
            defaultValue={defaultValue}
            onChange={value => {
                input.onChange(value);
                if(onInputChange) onInputChange(value, input);
            }}
            items={items}
            />
         </div>);
    }
}

export default RadiosField;

