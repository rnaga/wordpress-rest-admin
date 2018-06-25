

const httpNormalizeResponseBody = (httpResponse, options = {}) => {

    const {response: responses} = httpResponse;
    const {filter} = options;

    if( !Array.isArray(responses))
        return null;

    let merge = [];

    responses.forEach(response => {
        if(Array.isArray(response.body))
            merge = [...merge, ...response.body];
        else if(typeof response.body === 'string')
            merge = [...merge, response.body];
        else
            merge = [...merge, {...response.body}];
    });

    if(typeof filter === 'function'){
        merge = merge.map( v => {
            return filter(v);
        });
    }

    return merge;
}


export default httpResponse => {
    try{
        return httpNormalizeResponseBody(httpResponse);
    }catch(err){
        return null;
    }
}
