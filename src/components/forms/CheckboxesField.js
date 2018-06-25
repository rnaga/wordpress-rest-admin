import React from 'react';
import Checkboxes from '../Checkboxes';

class CheckboxesField extends React.Component {

    componentWillMount(){
        const {input, values} = this.props;
        input.onChange(values);
    }

    componentDidMount(){
        const {input, meta, onMount} = this.props;
        if(typeof onMount === 'function')
            onMount(input, meta);
    }

    handleChange(values){

        const {input, onInputChange} = this.props;

        input.onChange([...values]);

        if(typeof onInputChange === 'function')
            onInputChange(values, input);
    }

    render() {

        const {isChecked, 
               items, 
               values, 
               onChecked, 
               style = {}} = this.props;

        return (
          <Checkboxes 
              items={items}
              values={values}
              isChecked={isChecked} 
              onInputChange={this.handleChange.bind(this)}
              onChecked={onChecked}
              style={style}
          />);
    }

}

export default CheckboxesField;
