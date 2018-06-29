const initialState = {
    drawer: null,
    overlay: false,
    imagesBySku: {}
};

const reducer = (state = initialState, { error, payload, type, meta }) => {
    switch (type) {
        case 'TOGGLE_DRAWER': {
            return {
                ...state,
                drawer: payload,
                overlay: !!payload
            };
        }
        case 'GET_CART_DETAILS_PENDING': {
            return {
                ...state,
                gettingCart: true
            };
        }
        case 'GET_CART_DETAILS': {
            return {
                ...state,
                showError: error,
                gettingCart: false,
                cart: payload
            };
        }
        case 'ADD_ITEM_TO_CART_PENDING': {
            return {
                ...state,
                addingToCart: true
            };
        }
        case 'ADD_ITEM_TO_CART': {
            // cart items don't have images in the REST API;
            // this is the most efficient way to manage that,
            // but it should go in a data layer
            const { imagesBySku } = state;
            const {
                item: { sku },
                cartImage
            } = meta;
            if (sku && cartImage) {
                imagesBySku[sku] = cartImage;
            }
            return {
                ...state,
                imagesBySku,
                showError: error,
                addingToCart: false,
                lastItemAdded: payload
            };
        }
        default: {
            return state;
        }
    }
};

const selectAppState = ({ app }) => ({ app });

export { reducer as default, selectAppState };
