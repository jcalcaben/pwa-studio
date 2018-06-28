const initialState = {
    drawer: null,
    overlay: false
};

const reducer = (state = initialState, { error, payload, type }) => {
    switch (type) {
        case 'TOGGLE_DRAWER': {
            return {
                ...state,
                drawer: payload,
                overlay: !!payload
            };
        }
        case 'ADD_ITEM_TO_CART_PENDING': {
            return {
                ...state,
                addingToCart: true
            };
        }
        case 'ADD_ITEM_TO_CART': {
            return {
                ...state,
                showError: error,
                cartChanged: payload,
                addingToCart: false
            };
        }
        default: {
            return state;
        }
    }
};

const selectAppState = ({ app }) => ({ app });

export { reducer as default, selectAppState };
