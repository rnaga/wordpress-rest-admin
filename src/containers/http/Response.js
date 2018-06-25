import React from 'react';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import cloneReactElement from '../../util/cloneReactElement';

const render = props => {

    const {httpResponse, bindProp = 'responseBody', children} = props;

    const responseBody = httpNormalizeResponseBody(httpResponse);

    return React.Children.map(children, (child, i) => {
        const newChild = cloneReactElement(
            child,
            {[bindProp]: responseBody, httpResponse: httpResponse,});

        return newChild;
    });
}

export class Success extends React.Component {

    render(){

        const {httpResponse} = this.props;

        if(!httpResponse || !httpResponse.success)
            return null;

        return render(this.props) || null;
    }
}

export class Fail extends React.Component{
    render(){
        const {httpResponse} = this.props;

        if(!httpResponse || typeof httpResponse.success !== 'boolean' || 
           httpResponse.success)
            return null;

        return render(this.props) || null;
    }
}



