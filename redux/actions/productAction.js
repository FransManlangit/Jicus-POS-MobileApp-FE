import {
    ADD_TO_CART_PRODUCT,
    REMOVE_FROM_CART_PRODUCT,
    CLEAR_CART_PRODUCT
} from '../productConstant';

export const addToCart = (payload) => {
    console.log("payload",payload)
    return {
        type: ADD_TO_CART_PRODUCT,
        payload
    }
}

export const removeFromCart = (payload) => {
    return {
        type: REMOVE_FROM_CART_PRODUCT,
        payload
    }
}

export const clearCart = () => {
    return {
        type: CLEAR_CART_PRODUCT
    }
}