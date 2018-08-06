import newHttpError from '../util/newHttpError';
import {update as cacheUpdate} from '../util/cache';

// File uploader using media endpoint
export default (options) => {

    return (async () => {

        const {authResult, url, payload: file, ...restOptions} = options;
        const {method} = restOptions;

        const httpOptions = authResult ? authResult.httpOptions : null;

        if(httpOptions && httpOptions.headers){
            restOptions.headers = Object.assign({}, restOptions.headers, httpOptions.headers, restOptions.options.headers, {
                'Content-Disposition': `attachment; filename=${file.name}`,
            });
        }

        if(file && method.match(/^POST|PUT|DELETE$/)){
            restOptions.body = file;
        }        

        const results = await fetch(url, restOptions);
        const body = await results.json();

        const {headers, ok, status: statusCode} = results;

        const returnValue = {headers, ok, statusCode, body}; 

        if(!ok || (statusCode < 200 && statusCode > 299 ) ){
            throw newHttpError(`${body.message}`, returnValue);
        }

        // Clear cache used for jsonClient
        cacheUpdate('_jsonClient', 'media', {});

        return returnValue;

    })();
}
