import React from 'react';
import {Field} from 'redux-form';

import TextField from '../../forms/TextField';
import SelectField from '../../forms/SelectField';

const commentStatus = [
    {label: 'Open (Allow Comments)', value: 'open'},
    {label: 'Closed', value: 'closed'}
]

class MoreOptions extends React.Component {

    render(){

        const {edit = {}} = this.props;

        const defaultExcerptValue = typeof edit.excerpt === 'string'
                           ? edit.excerpt
                           : (edit.excerpt ? edit.excerpt.raw : '');

        return (<div style={{width: '100%'}}>
          <Field 
            component={TextField} 
            id="slug" 
            name="slug" 
            label="Slug" 
            defaultValue={edit.slug}
            style={{width: '100%'}}
            styleDiv={{paddingTop: 0}}
           />

          <Field 
            component={SelectField} 
            id="comment_status" 
            name="comment_status" 
            label="Comment Status" 
            defaultValue={edit.comment_status} 
            options={commentStatus} 
            style={{width: '100%'}}
          />

          <Field 
            component={TextField} 
            id="excerpt" 
            name="excerpt" 
            label="Excerpt" 
            defaultValue={defaultExcerptValue} 
            style={{width: '100%'}}
           />

          <div style={{height: '50px'}} />
          </div>);
    }
}

export default MoreOptions;
