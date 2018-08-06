import {all, put, call, takeLatest, takeEvery} from 'redux-saga/effects';
import {types, actions} from './actions';
import wpUrl from './util/wpUrl';
import caches from './util/caches';

function *http({httpClient, url, method, options, isProtected, authorizer, onSuccess, onFail, ...rest}){

    const {paths, payload} = options;
    const {httpId, requestId} = rest;

    var authResult = {};

    yield put(actions.httpInit({httpId, requestId}));

    if(isProtected){
        try{
            const {authorize, ...authOptions} = authorizer.options;
            authResult = yield call(authorize, ...authOptions);
        }catch(err){
            yield put({
                ...rest,
                success: false,
                response: err,
                type: types.HTTP_FAIL});
            return;
        }
    }

    let requests = [];

    switch(method){

        case 'GET':
            if(Array.isArray(paths)){
                requests = paths.map(path  => {
                    return {url: `${url}${path}`, method};
                });

                break;
            }

            requests = [{url, method}];
            break;

        case 'DELETE':
        case 'PUT':
        case 'POST':
            if(Array.isArray(payload)){
                requests = payload.map(_payload => {
                    return {url, method, payload: _payload};
                });
                break;    
            }

            requests = [{url, method, payload}];
            break;

        default:
            yield put({
                ...rest,
                success: false,
                response: new Error('invalid method'),
                type: types.HTTP_FAIL});
            return;
    }
    
    var success = true;
    var responses = [];
    var err;

    for(let i = 0; i < requests.length; i++) {

        let {url, method, payload} = requests[i];

        try{
            let response = yield call(httpClient, {
                ...{options}, url, method, payload, authResult
            });
            responses.push(response);
        }catch(_err){
            success = false;
            err = _err;
            break;
        }
    }

    if(success && typeof onSuccess === 'function'){
        yield call(onSuccess, responses);
    }

    if(!success){

        yield put({
            type: types.SHARED_STATE_SET,
            namespace: 'loading',
            state: {open: false},
        });

        yield put(actions.addError({message: err.toString()}));

        if(typeof onFail === 'function')
            yield call(onFail, err);
    }

    yield put({
        ...rest, 
        success, 
        response: responses, 
        type: success ? types.HTTP_SUCCESS : types.HTTP_FAIL});
}

function *init({httpClient, authorizer}){

    var authResult = {};

    const account = caches('account');    
    const site = caches('site');
    const wpBaseUrl = caches('wpBaseUrl');

    try{
        const {authorize, ...authOptions} = authorizer.options;
        authResult = yield call(authorize, ...authOptions);
    }catch(err){
        yield put({
            success: false,
            response: err,
            type: types.INIT_ADMIN_FAIL});
        return;
    }

    try{

        let accountResponse = yield call(httpClient, {
            url: wpUrl().path('users/me').query({context: 'edit'}).url,
            method: 'GET',
            authResult,
        });

console.log('-----------account----------------');
console.log(accountResponse);

        account.update(accountResponse.body);

        let siteResponse = yield call(httpClient, {
            url: `${wpBaseUrl.get()}/wp-json`,
            method: 'GET',
            authResult,
        });

        site.update(siteResponse.body);

        yield put({type: types.INIT_ADMIN_SUCCESS});

    }catch(err){
        const errorMessage = `${err}
            Make sure to enable this option you’ll need to edit your .htaccess file adding the follow.
            SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1"`;

        yield put(actions.addError({message: errorMessage}));
        yield put({type: types.INIT_ADMIN_FAIL, err});
    }
}

export default function *rootSaga(){
    yield all([
        takeEvery(types.HTTP, http),
        takeLatest(types.INIT_ADMIN, init),
    ]);
}
