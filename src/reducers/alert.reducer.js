import { alertConstants } from '../constants';

const autoClose = 3000;

export function alert(state = {}, action) {
  switch (action.type) {
    case alertConstants.LOADING:
      return {
        type: 'loading',
        key: action.key,
        duration: 0,
        message: action.message
      };
    case alertConstants.UPDATE:
      return {
        type: 'update',
        key: action.key,
        duration:action.duration || autoClose,
        message: action.message
      };
    case alertConstants.SUCCESS:
      return {
        type: 'success',
        key: action.key,
        duration:action.duration || autoClose,
        message: action.message
      };
    case alertConstants.WARNING:
      return {
        type: 'warning',
        key: action.key,
        duration:action.duration || autoClose,
        message: action.message
      };
    case alertConstants.ERROR:
      return {
        type: 'error',
        key: action.key,
        duration:action.duration || autoClose,
        message: action.message
      };
    case alertConstants.CLEAR:
      return {
        type: 'clear',
        key: action.key,
        duration: 2
      };
    default:
      return state
  }
}