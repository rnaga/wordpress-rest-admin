import React from 'react';
import {Field} from 'redux-form';

import RadiosField from '../../forms/RadiosField';

const format = [
    {label: 'Standard', value: 'standard'},
    {label: 'Aside', value: 'aside'},
    {label: 'Image', value: 'image'},
    {label: 'Video', value: 'video'},
    {label: 'Quote', value: 'quote'},
    {label: 'Link', value: 'link'},
    {label: 'Gallery', value: 'gallery'},
];

class Format extends React.Component {

    render(){
        const {edit} = this.props;

        return (<div style={{width: '100%'}}>
          <Field component={RadiosField} 
            id="format" 
            name="format" 
            label="Format" 
            defaultValue={edit.format} 
            items={format} 
            styleDiv={{paddingTop: 0}}
          />
          </div>);
    }
}

export default Format;
