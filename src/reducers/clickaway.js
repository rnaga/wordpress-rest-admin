import {types} from '../actions';

const initState = {};

export default (prevState = initState, {type, key, ref, index, onClickAway}) => {

    var clickaway = prevState[key] || {};
    var nextState;

    switch(type){

        case types.CLICKAWAY_REF:

            if(!clickaway.refs)
                clickaway.refs = [];

            clickaway.refs[index] = ref;

            nextState = Object.assign({}, prevState, {[key]: {...clickaway}}); 

            return nextState;

        case types.CLICKAWAY_ONCLICK:

            clickaway.onClickAway = onClickAway

            nextState = Object.assign({}, prevState, {[key]: {...clickaway}});

            return nextState;

        case types.CLICKAWAY_CLEAR:

            nextState = Object.assign({}, prevState, {[key]: null});

            return nextState;
           
        default: 

            return prevState;
    }
}



