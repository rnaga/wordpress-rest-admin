import {types} from '../actions';

const initState = {status: 'none'};

export default (prevState = initState, {type, err}) => {

    switch(type){

        case types.INIT_ADMIN_SUCCESS:
            return {status: 'success'}; 

        case types.INIT_ADMIN_FAIL:
            return {status: 'fail', err};

        default: 
            return prevState;
    }
}


