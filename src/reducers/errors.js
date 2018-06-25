import {types} from '../actions';

export default (prevState = [], {type, errors, error}) => {

    switch(type){

        case types.ERRORS_UPDATE:
            return errors.slice(0);

        case types.ERROR_ADD:
            prevState.push(error);
            return prevState.slice(0);

        default:
            return prevState;
    }
}

