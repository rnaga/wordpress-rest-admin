
import {types} from '../actions';

const initState = {};

export default (prevState = initState, {type, id, values}) => {

    switch(type){
        case types.FORM:
            const newState = Object.assign({}, prevState, {[id]: {values}});
            return newState;
        default: 
            return prevState;
    }
}


