import getCartId from './getCartId';
import restRequest from './restRequest';

export default async function getCartTotals() {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Getting cart totals. First getting cart ID...');
    }
    const cartId = await getCartId().promise;

    const cartTotalsRequest = restRequest({
        method: 'GET',
        path: `guest-carts/${cartId}/totals`
    });

    if (process.env.NODE_ENV !== 'production') {
        cartTotalsRequest.then(totals =>
            console.log('Cart totals retrieved', totals)
        );
    }
    return cartTotalsRequest;
}
