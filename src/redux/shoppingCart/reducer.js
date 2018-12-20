import * as a from './actionTypes';

let initialState = { pizzaSizes: null, pizzaSizeSelected: null };

const shoppingCartReducer = (state = initialState, action) => {

    switch (action.type) {
        case a.GET_PIZZA_SIZES:
            {
                const pizzaSizesData = action.data;
                // first data field is from axios, second is from graphql
                state = Object.assign({}, state, { pizzaSizes: pizzaSizesData.data.data });

                return state;
            }

        case a.SELECT_PIZZA_SIZE:
            {
                const pizzaSizeData = action.data;

                console.log('data from select pizza size ' + JSON.stringify(pizzaSizeData));

                state = Object.assign({}, state, { pizzaSizeSelected: pizzaSizeData });

                return state;
            }

        case a.TOGGLE_TOPPING:
            {
                const topping = action.data.topping;
                const index = action.data.index;

                console.log('data from toggle toping is ' + JSON.stringify(topping));

                //state = Object.assign({}, state, { ...state.pizzaSizeSelected.toppings, topping })
                //return state;

                /*
                return {
                    ...state, 
                    pizzaSizeSelected: { 
                        ...state.pizzaSizeSelected, 
                        toppings: {
                            ...state.pizzaSizeSelected.toppings,
                            topping,
                        }
                    }
                }
                */

                //return state;


                
                return {
                    ...state,
                    pizzaSizeSelected: {
                        ...state.pizzaSizeSelected,
                        toppings: state.pizzaSizeSelected.toppings.map((ctopping, cindex) => index === cindex ? topping : ctopping)

                    }
                }


            }

        default:
            return state;
    }

};

export default shoppingCartReducer;

