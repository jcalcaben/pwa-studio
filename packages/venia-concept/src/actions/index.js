import { canceller, postNewCartItem, getCart } from '../util/rest';

export function addItemToCart({ item, quantity }) {
    const media = item.media_gallery_entries || [];
    const cartImage = media.find(image => image.position === 1);
    return {
        type: 'ADD_ITEM_TO_CART',
        payload: postNewCartItem(item, quantity),
        meta: { item, quantity, cartImage }
    };
}

// supports rolling requests.
// will multicast any outstanding promise. If `forceRefresh` is true,
// it will abort the outstanding Promise and replace it with another.
let lastCartReq;
export function getCartDetails({ forceRefresh } = {}) {
    if (forceRefresh && lastCartReq) {
        lastCartReq.cancel();
        lastCartReq = null;
    }
    if (!lastCartReq) {
        const cartReq = getCart();
        lastCartReq = {
            promise: cartReq.then(
                cart => {
                    lastCartReq = null;
                    return cart;
                },
                () => {
                    lastCartReq = null;
                }
            ),
            cancel: canceller(cartReq)
        };
    }
    return {
        type: 'GET_CART_DETAILS',
        payload: lastCartReq.promise
    };
}

function toggleDrawer(drawerName) {
    return {
        type: 'TOGGLE_DRAWER',
        payload: drawerName
    };
}

export function toggleCart() {
    return toggleDrawer('cart');
}
