import getCartId from './getCartId';
import restRequest from './restRequest';

export default async function getCart() {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Getting cart. First getting cart ID...');
    }
    const cartId = await getCartId();

    const cart = restRequest({
        method: 'GET',
        path: `guest-carts/${cartId}`
    });

    if (process.env.NODE_ENV !== 'production') {
        console.log('Cart retrieved', cart);
    }
    return cart;
}
