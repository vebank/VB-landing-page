import { alertConstants } from '../constants';

export const alertActions = {
    loading,
    update,
    warning,
    success,
    error,
    clear
};

function loading(message, key) {
    return { type: alertConstants.LOADING, message, key };
}
function update(message, key) {
    return { type: alertConstants.UPDATE, message, key };
}
function success(message, key) {
    return { type: alertConstants.SUCCESS, message, key };
}
function warning(message, key) {
    return { type: alertConstants.WARNING, message, key };
}
function error(message, key) {
    return { type: alertConstants.ERROR, message, key };
}

function clear(key) {
    return { type: alertConstants.CLEAR, key };
}