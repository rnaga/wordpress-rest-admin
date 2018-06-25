import {actions} from '../actions';

export default (dispatch, message) => {
   dispatch(actions.addError({message})); 
}
