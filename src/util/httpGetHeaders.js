

const httpGetHeaders = (httpResponse, offset = 0) => {

    const {response} = httpResponse;

    if( !Array.isArray(response))
        return null;

    var headers = {};

    (response[offset].headers).forEach( (v, name) => {
        headers[name] = v;
    });

    return headers;
}


export default (httpResponse, offset) => {
    try{
        return httpGetHeaders(httpResponse, offset);
    }catch(err){
        return null;
    }
}
