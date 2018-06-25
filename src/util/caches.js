import Cache from './cache';
import Cookies from 'universal-cookie';

const accountCache = new Cache('account');

const account = {
    update: value => {
        account.id = value['id'];
        account.role = value['roles'][0];
        account.cap = value['capabilities']
        accountCache.update('value', value)
    },

    get: () => accountCache.getOne('value')
}

const siteCache = new Cache('site');

const site = {
    update: value => siteCache.update('value', value),
    get: () => siteCache.getOne('value'),
}

const cookies = new Cookies();

const wpBaseUrl = {
    update: value => cookies.set('siteurl', value, {path: '/', maxAge: 604800}),
    get: () => cookies.get('siteurl'),
}

const defaultAuthorizerCache = new Cache('authorizer');

const defaultAuthorizer = {
    update: value => defaultAuthorizerCache.update('value', value),
    get: () => defaultAuthorizerCache.getOne('value'),
}

const defaultHttpClientCache = new Cache('httpClient');

const defaultHttpClient = {
    update: value => defaultHttpClientCache.update('value', value),
    get: () => defaultHttpClientCache.getOne('value'),
}


export {
    account, 
    site,
    wpBaseUrl,
    defaultAuthorizer,
    defaultHttpClient,
};

