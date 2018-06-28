import getCartId from './getCartId';
import restRequest from './restRequest';

export default async function postNewCartItem(item, qty) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Adding cart item. First getting cart ID...');
    }
    const cartId = await getCartId();

    const cartItem = await restRequest({
        method: 'POST',
        path: `guest-carts/${cartId}/items`,
        body: JSON.stringify({
            cartItem: {
                qty,
                sku: item.sku,
                name: item.name,
                quote_id: cartId
            }
        })
    });

    if (process.env.NODE_ENV !== 'production') {
        console.log('Cart item added', cartItem);
    }
    return cartItem;
}
