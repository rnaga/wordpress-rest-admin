import React from 'react';

class Image extends React.Component {
    render(){
//        return <img alt="__image__" {...this.props} onLoad={this.onLoad.bind(this)} /> 
        return <img alt="__image__" {...this.props} />
    }
}

export default Image;
