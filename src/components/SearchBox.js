import React from 'react';
import {compose} from 'recompose';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import withStyles from '../hoc/withStyles';
import getIcon from '../util/getIcon';

const Search = getIcon({iconName: 'Search'});

class SearchBox extends React.Component {

    render(){

        const {cssStyles, className, onKeyDown, onChange, defaultValue, style ={}} = this.props;

        return (
          <TextField
            style={style}
            defaultValue={defaultValue}
            onKeyDown={e => {
                onKeyDown && onKeyDown(e)
            }}
            onChange={e => {
                onChange && onChange(e)
            }}
            className={className}
            InputProps={{
              disableUnderline: true,
              classes: {
                input: cssStyles.textFieldDefaultInput,
                root: cssStyles.textFieldDefaultRoot,
              },
              startAdornment: (
                <InputAdornment position="start" style={{paddingLeft: 5}}>
                  <Search style={{color: 'grey'}}/>
                </InputAdornment>
              ),
            }}
           />);
    }
}

export default compose(
    withStyles,
)(SearchBox);
