import Cache from './cache';
import Cookies from 'universal-cookie';

const cachesName = '___wp_rest_admin_caches___';

window[cachesName] = window[cachesName] || {};

const _ = window[cachesName];

_.accountCache = _.accountCache || new Cache('account');

_.account = {
    update: value => {
        _.account.id = value['id'];
        _.account.role = value['roles'][0];
        _.account.cap = value['capabilities']
        _.accountCache.update('value', value)
    },

    get: () => _.accountCache.getOne('value')
}

_.siteCache = _.siteCache || new Cache('site');

_.site = {
    update: value => _.siteCache.update('value', value),
    get: () => _.siteCache.getOne('value'),
}

_.cookies = _.cookies || new Cookies();

_.wpBaseUrl = {
    update: value => _.cookies.set('siteurl', value, {path: '/', maxAge: 604800}),
    get: () => _.cookies.get('siteurl'),
}

_.defaultAuthorizerCache = _.defaultAuthorizerCache || new Cache('authorizer');

_.defaultAuthorizer = {
    update: value => _.defaultAuthorizerCache.update('value', value),
    get: () => _.defaultAuthorizerCache.getOne('value'),
}

_.defaultHttpClientCache = _.defaultHttpClientCache || new Cache('httpClient');

_.defaultHttpClient = {
    update: value => _.defaultHttpClientCache.update('value', value),
    get: () => _.defaultHttpClientCache.getOne('value'),
}

/*
const account = window[cachesName].account;
const site = window[cachesName].site;
const wpBaseUrl = window[cachesName].wpBaseUrl;
const defaultAuthorizer = window[cachesName].defaultAuthorizer;
const defaultHttpClient = window[cachesName].defaultHttpClient;
*/
export default namespace => {
    return window[cachesName][namespace];
}

//export {cachesName, account, site, wpBaseUrl, defaultAuthorizer, defaultHttpClient};


