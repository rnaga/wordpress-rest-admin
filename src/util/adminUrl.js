import createLink from './createLink';
import queryString from 'querystring';

class adminUrl{

    constructor(contentName, pageName){

        const {basePath, linkTo} = createLink(contentName);

        this.contentName = contentName;
        this.pageName = pageName;
        this.baseRootPath = basePath;
        this.basePath = linkTo;

        this._query = null;

        this.url = this.toString();
    }

    page(pageName){
        this.pageName = pageName;
        this.url = this.toString();
        return this;
    }

    query(query){

        if(query)
            this._query = Object.assign({}, this._query, query);

        this.url = this.toString();

        return this;
    }

    toString(){

        var url = this.basePath;
        
        if(this.pageName.length > 0)
            url = `${url}/${this.pageName}`;

        if(this._query)
            url = `${url}?${queryString.stringify(this._query)}`;

        return url;
    }
}

export default (contentName, pageName = '') => {
    return new adminUrl(contentName, pageName);
}


