import React from 'react';

class List extends React.Component{

    render(){

        const {__content: content} = this.props;

        // This is what appears in the content area
        return (<div>
            <span style={{display: 'block', fontSize: '1.5rem', padding: '10px 0px'}}>List Page</span>
            <a href={`#${content.contentBasePath}/Edit`} style={{paddingRight: 10}}>Edit Page</a>
            <a href={`#${content.contentBasePath}/Create`}>Create Page</a>
        </div>);
    }
}

export default List;

