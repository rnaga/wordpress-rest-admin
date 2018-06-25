import React from 'react';
//import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {actions} from '../actions';
import withHttp from '../hoc/withHttp';
import {account} from '../util/caches';
import httpNormalizeResponseBody from '../util/httpNormalizeResponseBody';
import wpUrl from '../util/wpUrl';
import {defaultAuthorizer, defaultHttpClient} from '../util/caches';

const withAdmin = WrappedComponent => {

    class Hoc extends React.Component{

        initAdmin(options = {}){

            const {dispatch} = this.props;

            const httpClient = options.httpClient || defaultHttpClient.get();
            const authorizer = options.authorizer || defaultAuthorizer.get();

            dispatch(actions.initAdmin({httpClient, authorizer}));
        }

        httpUserAccount(){
            const {http} = this.props;

            return new Promise( (resolve, reject) => {
                http('_my_account', {
                    url: wpUrl().path('users/me').query({context: 'edit'}).url,
                    method: 'GET',
                    isProtected: true,
                    onSuccess: response => {
                        resolve(httpNormalizeResponseBody({response})[0]);
                    },
                });
            });
        }

        async updateMyAccount(){
            const value = await this.httpUserAccount();
            account.update(value);
            return value;
        }

        getMyAccount(){
            return account.get();
        }

        render(){
            return (
              <WrappedComponent 
                {...this.props}
                initAdmin={this.initAdmin.bind(this)}
                updateMyAccount={this.updateMyAccount.bind(this)}
                getMyAccount={this.getMyAccount.bind(this)}
              />);
        }
    }

    return compose(
        withHttp(), 
        connect())(Hoc); 
}

export default withAdmin;
