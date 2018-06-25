import React from 'react';
import {compose} from 'recompose';
import moment from 'moment';
import MuiTextField from '@material-ui/core/TextField';
import withStyles from '../../hoc/withStyles';
import getIcon from '../../util/getIcon';

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
               defaultValue, 
               id, 
               name, 
               label, 
               cssStyles, 
               style: _style = {}, 
               onInputChange,
               onMount,
               ...rest} = this.props;

        const QueryBuilder = getIcon({iconName: 'QueryBuilder'});
        const style = Object.assign({minWidth: 160, paddingBottom: 10}, _style); 

        const dateTime = defaultValue || moment().format('YYYY-MM-DDTHH:mm:ss');

        return (<div style={{display: 'flex'}}>
          <QueryBuilder style={{width: 18, height: 26}}/>
          <MuiTextField
              {...rest}
              id={id} 
              name={name}
              defaultValue={input.value || dateTime}
              onChange={e => {
                  input.onChange(e);
                  if(onInputChange) onInputChange(e.target.value, input);
              }}
              style={style}
              InputLabelProps={{
                classes: {
//                  root: cssStyles.textFieldDefaultInputLabelRoot,
                }
              }}
              InputProps={{
                disableUnderline: true,
                classes: {
                  input: cssStyles.datetimeFieldDefaultInput,
                  root: cssStyles.datetimeFieldDefaultRoot,
                }
              }}
          />
        </div>);
    }
}

export default compose(withStyles)(TextField);
