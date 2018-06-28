import restRequest from './restRequest';

let cartId;
export default async function getCartId({ forceRefresh } = {}) {
    if (!cartId || forceRefresh) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('No cart ID saved. Getting a cart ID via REST...');
        }
        cartId = await restRequest({
            method: 'POST',
            path: 'guest-carts'
        });
        if (process.env.NODE_ENV !== 'production') {
            console.log('Stored cart ID', cartId);
        }
    }
    return cartId;
}
