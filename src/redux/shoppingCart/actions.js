import * as a from './actionTypes';
import * as api from './api';


export function getPizzaSizes(successCB, errorCB) {
    return (dispatch) => {
        api.getPizzaSizes(function (success, data, error) {
            if (success) {
                dispatch({ type: a.GET_PIZZA_SIZES, data: data });
                successCB(data);
            } else if (error)
                errorCB(error)
        });
    };
}

export function selectPizzaSize(data, successCB) {
    return (dispatch)=> {
        dispatch({ type: a.SELECT_PIZZA_SIZE, data:data });
        successCB();
    }
}

export function toggleTopping(data, successCB) {
    return (dispatch)=> {
        dispatch({ type: a.TOGGLE_TOPPING, data:data });
        successCB();
    }
}