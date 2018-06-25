import {wpBaseUrl, account} from './caches';
import queryString from 'querystring';

class wpUrl{

    constructor({path, query}){
        this._baseUrl = wpBaseUrl.get();
        this.path(path);
        this.query(query);
    }

    parseUrl(url){
//        const match = url.match(new RegExp(`^${this._baseUrl}/${this._path}([a-zA-Z0-9]+)(?:$|/$|/([a-zA-Z0-9]+))`));
        const match = url.match(new RegExp(`^${this._baseUrl}/${this._path}([a-zA-Z0-9]+)`));
      
        if(!match)
            return {resource: undefined, id: undefined};

        const [,resource,id] = match;

        return {resource, id};
    }

    path(path){
        this._path = `wp-json/wp/v2/${path}`;
        this.url = this.toString();
        return this;   
    }

    query(query){

        if(query)
            this._query = Object.assign({}, this._query, query);

        this.url = this.toString();

        return this;
    }

    queryFunc(func){

        this._query = Object.assign({}, this._query, func({account}));

        this.url = this.toString();

        return this;
    }

    toString(){
        var url = `${this._baseUrl}/${this._path}`

        if(typeof this._query === 'object')
            url = `${url}?${queryString.stringify(this._query)}`
        return url;
    }
}

const wpUrlEdit = ({path, query}) => {

    const _wpUrl = new wpUrl({path, query});

    _wpUrl.queryFunc( ({account}) => {
        if(account.role !== 'administrator')
            return {author: account.id};

        return null;
    })

    return _wpUrl
}

const wpUrlPosts = query => {

    const _wpUrl = new wpUrl({path: 'posts', query});

    _wpUrl.queryFunc( ({account}) => {
        if(!account.cap.edit_others_posts)
            return {author: account.id};

        return null;
    })

    return _wpUrl
}

const wpUrlMe = query => wpUrlEdit({path: 'me', query});

export default (args = {}) => {
    const {path = '', query = {}} = args;
    return new wpUrl({query, path});
}

export {wpUrlPosts, wpUrlMe};
 

