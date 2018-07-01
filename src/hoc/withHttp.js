import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {actions} from '../actions';
import caches from '../util/caches';

const withHttp = (options = {}) => (WrappedComponent) => {

    const httpId = options.httpId || Math.random();

    class Hoc extends React.Component{

        constructor(props){

            super(props);

            this.http = this.http.bind(this);
            this.httpFlush = this.httpFlush.bind(this);
            this.httpGetResponse = this.httpGetResponse.bind(this);

            this.refer = {};

            this.httpId = httpId;
        }

        componentWillUnmount() {
            this.httpFlush();
        }

        setRequestId(id, o){
            if(!this.refer[id])
                this.refer[id] = {...o};
        }

        http(id, options){

            const defaultAuthorizer = caches('defaultAuthorizer');
            const defaultHttpClient = caches('defaultHttpClient');

            var {authorizer = defaultAuthorizer.get(),
                 httpClient = defaultHttpClient.get(),
                 onSuccess = null,
                 onFail = null,
                 options: requestOptions = {},
                 url, 
                 method,
                 isProtected} = options;

            isProtected = isProtected || this.props.isProtected;

            const httpId = this.httpId;

            const {dispatch, authResult} = this.props;

            this.setRequestId(id, {});

            dispatch(actions.http({
                httpClient,
                authorizer,
                isProtected,
                onSuccess,
                onFail,
                url,
                method,
                options: requestOptions,
                authResult,
                httpId,
                requestId: id,
            }));
        }

        httpGetResponse(requestId){

            const {responses} = this.props;
 
            try{
                return responses[requestId];
            }catch(err){
                return null;
            }
        }


        httpFlush(){

            const _self = this;

            const {dispatch} = _self.props;
            dispatch(actions.httpFlush({httpId: _self.httpId}));
        }

        render(){

            const {responses} = this.props;
            const defaultHttpClient = caches('defaultHttpClient');

            return (<WrappedComponent 
                     {...this.props}
                     http={this.http}
                     httpClient={defaultHttpClient.get()}
                     httpResponse={responses}
                     httpFlush={this.httpFlush} 
                     httpGetResponse={this.httpGetResponse}
                    >{this.props.children}</WrappedComponent>);
        }
    }

    const mapStateToProps = (state, ownProps) => ({
        responses: state.http[httpId],
    })

    return compose(
        connect(mapStateToProps),
    )(Hoc);
}

export default withHttp;
