import React from 'react';

class Edit extends React.Component{

    render(){
        const {__content: content} = this.props;
 
        return(<div>
          <span style={{display: 'block', fontSize: '1.5rem', padding: '10px 0px'}}>Edit Page</span>
          <a href={`#${content.contentBasePath}`}>Back</a>
        </div>);
    }

}

export default Edit;

