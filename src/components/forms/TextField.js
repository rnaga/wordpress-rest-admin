import React from 'react';
import {compose} from 'recompose';
import MuiTextField from '@material-ui/core/TextField';
import withStyles from '../../hoc/withStyles';

class TextField extends React.Component {

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
               type = 'text',
               defaultValue, 
               id, 
               name, 
               label, 
               isEdit, 
               cssStyles, 
               fullWidth = false,
               style: _style = {}, 
               styleDiv: _styleDiv = {},
               onInputChange,
               placeholder = '',
               cssRoot = null,
               ...rest} = this.props;

        const style = Object.assign({}, {width: fullWidth ? '100%' : '80%', paddingBottom: 10}, _style); 
        const styleDiv = Object.assign({paddingTop: 10}, _styleDiv);

        if(isEdit && !defaultValue)
            return null;

        return (<div style={styleDiv}>
          <MuiTextField
              {...rest}
              type={type}
              id={id} 
              name={name}
              label={label}
              placeholder={placeholder}
              defaultValue={input.value || defaultValue}
              onChange={e => {
                  input.onChange(e);
                  if(onInputChange)
                      onInputChange(e.target.value, input);
              }}
              style={style}
              InputLabelProps={{
                shrink: true,
                classes: {
                  root: cssStyles.textFieldDefaultInputLabelRoot,
                }
              }}
              InputProps={{
                disableUnderline: true,
                classes: {
                  input: cssStyles.textFieldDefaultInput,
                  root: cssRoot || cssStyles.textFieldDefaultRoot,
                }
              }}
          />
          {/*displayBlock &&
          <span style={{display: 'block'}} />*/}
        </div>);
    }
}

export default compose(withStyles)(TextField);
