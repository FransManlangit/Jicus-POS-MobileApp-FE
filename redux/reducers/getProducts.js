import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAIL
  } from '../getProductConstant';
  
  const initialState = {
    products: [],
    loading: false,
    error: null,
  };
  
  const getProducts = (state = initialState, action) => {
    switch (action.type) {
      case GET_PRODUCTS_REQUEST:
        return { ...state, loading: true };
      case GET_PRODUCTS_SUCCESS:
        return { ...state, loading: false, products: action.payload };
      case GET_PRODUCTS_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default getProducts;