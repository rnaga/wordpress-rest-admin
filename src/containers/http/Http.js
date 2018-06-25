import React from 'react';
import {compose} from 'recompose';

import generateHash from '../../util/generateHash';
import cloneReactElement from '../../util/cloneReactElement';
import withHttp from '../../hoc/withHttp';
import withPropsFilter from '../../hoc/withPropsFilter';
import withParent from '../../hoc/withParent';

class Http extends React.Component {

    componentWillMount(){

        var {http, url, method, payload} = this.props;

        this.requestId = generateHash(url, method);

        http(this.requestId, {
            url,
            method,
            options: {payload},
        });
    }

    render(){

        const {httpResponse: _httpResponse, children, bindProp} = this.props;
        const requestId = this.requestId;

        // Check to see if the response has been received
        try{
            if( !_httpResponse[requestId].response ) 
                return null;
        }catch(err){
            return null;
        }

        const httpResponse = Object.assign({}, _httpResponse[requestId]);

        // Passing httpResponse to its children
        return React.Children.map(children, (child, i) => {
            return cloneReactElement(
                child,
                {bindProp, httpResponse: httpResponse},
                child.props.children
            )
        });
    }
}

export default compose(
    withPropsFilter(),
    withParent,
    withHttp(),
)(Http);
