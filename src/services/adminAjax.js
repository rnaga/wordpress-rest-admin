/*

Need these set in wordpress

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Authorization");

add_filter('allowed_http_origins', 'add_allowed_origins');

function add_allowed_origins($origins) {
    $origins[] = 'http://localhost:3333';
    return $origins;
}   

*/
export default (options) => {

    return (async () => {

        const {authResult: {httpOptions}, url, payload, ...restOptions} = options;
        const {method} = restOptions;


        restOptions.headers = Object.assign({}, restOptions.headers || {}, {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        });

        if(httpOptions && httpOptions.headers){
            restOptions.headers = Object.assign({}, restOptions.headers, httpOptions.headers);
        }

        if(payload && method.match(/^POST|PUT$/)){
            restOptions.body = encodeURI(payload); 
        }        

        const results = await fetch(url, restOptions);
        const body = await results.text();
        const {headers, ok, status: statusCode} = results;

        const returnValue = {headers, ok, statusCode, body}; 

        if(!ok || (statusCode < 200 && statusCode > 299 ) )
            throw new Error(Object.assign({}, {err: 'http request failed'}, returnValue));

        return returnValue;

    })();
}
