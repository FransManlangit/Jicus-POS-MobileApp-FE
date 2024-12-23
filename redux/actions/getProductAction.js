// import axios from 'axios';
// import {
//   GET_PRODUCTS_REQUEST,
//   GET_PRODUCTS_SUCCESS,
//   GET_PRODUCTS_FAIL
// } from '../getProductConstant';

// export const getProducts = () => async (dispatch) => {
//   try {
//     dispatch({ type: GET_PRODUCTS_REQUEST });
//     const { data } = await axios.get('/api/v1/products');
//     dispatch({ type: GET_PRODUCTS_SUCCESS, payload: data.products });
//   } catch (error) {
//     dispatch({
//       type: GET_PRODUCTS_FAIL,
//       payload: error.response && error.response.data.message
//         ? error.response.data.message
//         : error.message,
//     });
//   }
// };