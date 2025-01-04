import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
} from '../Constant';

const initialState = [];

const cartItems = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return [...state, action.payload]; // Add new item to cart

        case REMOVE_FROM_CART:
            // Remove item from cart, assuming payload has a unique identifier
            return state.filter(cartItem => cartItem.id !== action.payload.id);

        case CLEAR_CART:
            return []; // Clear the cart by returning an empty array

        default:
            return state; // Return current state for unknown actions
    }
};

export default cartItems;
