import {types} from '../actions';

const initState = {isloggedin: false};

export default (prevState = initState, {type, isloggedin}) => {

    switch(type){

        case types.AUTH:
            return {isloggedin}; 

        default: 
            return prevState;
    }
}


