import React from 'react';
import {Field} from 'redux-form';
import withStyles from '../../hoc/withStyles';
import TextField from '../forms/TextField';

class PostTitle extends React.Component {

    render(){

        const {edit = {}, cssStyles} = this.props;

        const defaultValue = typeof edit.title === 'string' 
                           ? edit.title
                           : (edit.title ? edit.title.raw : '');
                          

        return (<div>
          <Field 
            component={TextField} 
            id="title" 
            name="title" 
            placeholder='Title'
            defaultValue={defaultValue}
            styleDiv={{paddingTop: 10}}
            style={{width: '100%'}}
            cssRoot={cssStyles.titleFieldDefaultRoot}
           />

          </div>);
    }
}

export default withStyles(PostTitle);
