
import {types} from '../actions';

const initState = {uploading: {}, complete: []};

export default (prevState = initState, {type, key, file, html}) => {

    var {uploading, complete} = prevState;
    var newUploading, newComplete;

    switch(type){

        case types.MEDIA_UPLOAD:

            newUploading = Object.assign({}, uploading, {[key]: {file, html}});
            return {uploading: newUploading, complete} 

        case types.MEDIA_UPLOAD_COMPLETE:

            newComplete = [...complete, ...[uploading[key]]];

            delete uploading[key];

            newUploading = {...uploading};

            return {uploading: newUploading, complete: newComplete};

        default: 

            return prevState;
    }
}


