import newHttpError from '../util/newHttpError';
import wpUrl from '../util/wpUrl';
import Cache from '../util/cache';

// To cache GET responses
const cache = new Cache('_jsonClient');

export default (options) => {

    return (async () => {

        const {authResult, url, payload, ...restOptions} = options;
        const {method} = restOptions;

        const httpOptions = authResult ? authResult.httpOptions : null;

        // Parse and get resouce name
        const {resource} = wpUrl().parseUrl(url);

        restOptions.headers = Object.assign({}, restOptions.headers || {}, {
            "Content-Type": "application/json"
        });

        if(httpOptions && httpOptions.headers){
            restOptions.headers = Object.assign({}, restOptions.headers, httpOptions.headers);
        }

        if(payload && method.match(/^POST|PUT|DELETE$/)){
            restOptions.body = JSON.stringify(payload);
        }        

        // Get response value from cache
        if(method === 'GET' && resource){

            let cachedValue = cache.getOne(resource);

            if(cachedValue && typeof cachedValue[url] === 'object')
                return cachedValue[url];
        }

        const results = await fetch(url, restOptions);
        const body = await results.json();

        const {headers, ok, status: statusCode} = results;

        const returnValue = {headers, ok, statusCode, body}; 

        if(!ok || (statusCode < 200 && statusCode > 299 ) ){
            throw newHttpError(`${body.message}`, returnValue);
        }

        if(resource){
            let cachedValue = cache.getOne(resource) || {};
 
            if(method === 'GET'){
                // Cache response
                cache.update(resource, Object.assign(cachedValue, {[url]: returnValue}));
            }else{
                // Flush response
                cache.update(resource, {});
            }
        }

        return returnValue;

    })();
}
