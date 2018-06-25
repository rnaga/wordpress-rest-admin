import {types} from '../actions';

const initState = {};

export default (prevState = initState, 
    {type, requestId, response, httpId}) => { 

    var newState, prevResponse, nextResponse;

    switch(type){

        case types.HTTP_FLUSH:

            newState = Object.assign({}, prevState);

            delete newState[httpId];
            return newState;

        case types.HTTP_INIT:

            prevResponse = prevState[httpId] || {};
            nextResponse = Object.assign({}, prevResponse, {[requestId]: {}});

            newState = Object.assign({}, prevState, {[httpId]: nextResponse});
            return newState;
            
        case types.HTTP_FAIL:
        case types.HTTP_SUCCESS:

            prevResponse = prevState[httpId] || {};
            nextResponse = Object.assign({}, prevResponse, {[requestId]: {
                success: type === types.HTTP_SUCCESS ? true : false,
                response,
            }});

            newState = Object.assign({}, prevState, {[httpId]: nextResponse});

            return newState; 

        default:
            return prevState;
    }
}

