
import {types} from '../actions';

const initState = {};

export default (prevState = initState, {type, namespace, state}) => {

    switch(type){
        case types.SHARED_STATE_SET:
            const newState = Object.assign({}, prevState, {[namespace]: state});
            return newState;
        default: 
            return prevState;
    }
}



