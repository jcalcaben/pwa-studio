import isPromise from 'is-promise';
/**
 * For any action with a promise as payload, first dispatch a "PENDING" action.
 * This allows for easy loading state.
 *
 * @param {Store} store The store to augment.
 * @returns {Function}
 */
const promisePending = ({ dispatch }) => next => action => {
    const { type, payload } = action;
    if (isPromise(payload)) {
        dispatch({
            type: `${type}_PENDING`,
            meta: { action }
        });
    }
    return next(action);
};

export default promisePending;
