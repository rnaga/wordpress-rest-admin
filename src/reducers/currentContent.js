import {types} from '../actions';

const initState = {};

export default (prevState = initState, {type, pageName, content}) => {

    switch(type){
        case types.CURRENT_CONTENT:
            return {pageName, content};
        default:
            return prevState;
    }
}

