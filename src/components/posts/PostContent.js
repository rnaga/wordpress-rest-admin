import React from 'react';
//import {compose} from 'recompose';
import {Field} from 'redux-form';
import HtmlField from '../../components/forms/HtmlField';


class Content extends React.Component{
    render(){

        const {edit = {}} = this.props;

        const defaultValue = typeof edit.content === 'string'
                           ? edit.content
                           : (edit.content ? edit.content.raw : '');

        return (<div>
          <Field 
            component={HtmlField} 
            id="content" 
            name="content" 
            label="Content" 
            defaultValue={defaultValue} 
          />
        </div>);
    }
}

export default Content;
