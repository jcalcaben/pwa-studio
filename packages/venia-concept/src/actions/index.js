import { postNewCartItem, getCart } from '../util/rest';

export function addItemToCart({ item, quantity }) {
    return {
        type: 'ADD_ITEM_TO_CART',
        payload: postNewCartItem(item, quantity)
    };
}

export function getCartDetails() {
    return {
        type: 'GET_CART_DETAILS',
        payload: getCart()
    };
}
