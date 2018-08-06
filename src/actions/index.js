
const types = {
    HTTP: 'HTTP',
    HTTP_FLUSH: 'HTTP_FLUSH',
    HTTP_INIT: 'HTTP_INIT',
    HTTP_SUCCESS: 'HTTP_SUCCESS',
    HTTP_FAIL: 'HTTP_FAIL',
    SHARED_STATE_SET: 'SHARED_STATE_SET',
    FORM: 'FORM',
    CURRENT_CONTENT: 'CURRENT_CONTENT',
    INIT_ADMIN: 'INIT_ADMIN',
    INIT_ADMIN_SUCCESS: 'INIT_ADMIN_SUCCESS',
    INIT_ADMIN_FAIL: 'INIT_ADMIN_FAIL',
    CLICKAWAY_REF: 'CLICKAWAY_REF',
    CLICKAWAY_ONCLICK: 'CLICKAWAY_ONCLICK',
    CLICKAWAY_CLEAR: 'CLICKAWAY_CLEAR',
    ERRORS_UPDATE: 'ERRORS_UPDATE',
    ERROR_ADD: 'ERROR_ADD',
    MEDIA_UPLOAD: 'MEDIA_UPLOAD',
    MEDIA_UPLOAD_COMPLETE: 'MEDIA_UPLOAD_COMPLETE',
}

const actions = {
 
    mediaUpload: ({key, file, html}) => ({
        type: types.MEDIA_UPLOAD,
        key,
        file,
        html,
    }),

    mediaUploadComplete: ({key}) => ({
        type: types.MEDIA_UPLOAD_COMPLETE,
        key
    }), 

    updateErrors: ({errors}) => ({
        type: types.ERRORS_UPDATE,
        errors,
    }),

    addError: error => ({
        type: types.ERROR_ADD,
        error,
    }),

    clickAwayRef: ({key, ref, index = 0}) => ({
        type: types.CLICKAWAY_REF,
        key,
        ref,
        index,
    }),

    clickAwayOnClickAway: ({key, onClickAway}) => ({
        type: types.CLICKAWAY_ONCLICK,
        key,
        onClickAway,
    }),

    clickAwayClear: key => ({
        type: types.CLICKAWAY_CLEAR,
        key,
    }),

    initAdmin: ({httpClient, authorizer}) => ({
        type: types.INIT_ADMIN,
        status: 'progress',
        httpClient,
        authorizer,
    }),

    currentContent: ({content, pageName}) => ({
        type: types.CURRENT_CONTENT,
        pageName,
        content,
    }),

    setFormValues: (id, values) => ({
        type: types.FORM,
        id,
        values,
    }),

    clearFormValues: id => ({
        type: types.FORM,
        id,
        values: null,
    }),

    setSharedState: (namespace, state) => ({
        type: types.SHARED_STATE_SET,
        namespace,
        state,
    }),

    httpFlush: options => {
        const {httpId} = options;

        return {
            type: types.HTTP_FLUSH,
            httpId,
        }
    },

    httpInit: options => {

        const {httpId, requestId} = options;

        return {
            type: types.HTTP_INIT,
            httpId,
            requestId,
        }
    },

    http: options => {

        const {httpClient,
               authorizer,
               isProtected,
               url, 
               httpId, 
               requestId, 
               method, 
               authResult, 
               onSuccess, 
               onFail, 
               options: requestOptions} = options;

        return {
            type: types.HTTP,
            httpClient,
            authorizer,
            isProtected,
            url,
            httpId,
            requestId,
            method,
            authResult,
            onSuccess,
            onFail,
            options: requestOptions,
        }
    },

}

export {types, actions};
