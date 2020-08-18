import { useCallback, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

/**
 * This talon contains the logic for a coupon code form component.
 * It performs effects and returns props data for rendering the component.
 *
 * @function
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Callback function for setting the update state for the cart.
 * @param {CouponCodeMutations} props.mutations GraphQL mutations for a cart's coupon code.
 * @param {CouponCodeQueries} props.queries GraphQL queries for a cart's coupon code.
 *
 * @return {CouponCodeProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useCouponCode } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/useCouponCode';
 */
export const useCouponCode = props => {
    const {
        setIsCartUpdating,
        /**
         * GraphQL mutations for a cart's coupon code.
         * This is a type used by the {@link useCouponCode} talon.
         *
         * @typedef {Object} CouponCodeMutations
         *
         * @property {GraphQLAST} applyCouponMutation Mutation for applying a coupon code to a cart.
         * @property {GraphQLAST} removeCouponMutation Mutation for removing a coupon code from a cart.
         *
         * @see [CouponCode.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.js}
         * for the queries used Venia
         */
        mutations: { applyCouponMutation, removeCouponMutation },
        /**
         * GraphQL queries for a cart's coupon code.
         * This is a type used by the {@link useCouponCode} talon.
         *
         * @typedef {Object} CouponCodeQueries
         *
         * @property {GraphQLAST} getAppliedCouponsQuery Query to fetch the currently applied coupons for a cart.
         *
         * @see [CouponCode.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.js}
         * for the queries used Venia
         */
        queries: { getAppliedCouponsQuery }
    } = props;

    const [{ cartId }] = useCartContext();
    const [fetchAppliedCoupons, { data, error: fetchError }] = useLazyQuery(
        getAppliedCouponsQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const [
        applyCoupon,
        {
            called: applyCouponCalled,
            error: applyError,
            loading: applyingCoupon
        }
    ] = useMutation(applyCouponMutation);

    const [
        removeCoupon,
        {
            called: removeCouponCalled,
            error: removeCouponError,
            loading: removingCoupon
        }
    ] = useMutation(removeCouponMutation);

    const handleApplyCoupon = useCallback(
        async ({ couponCode }) => {
            if (!couponCode) return;
            try {
                await applyCoupon({
                    variables: {
                        cartId,
                        couponCode
                    }
                });
            } catch (err) {
                console.error(err);
            }
        },
        [applyCoupon, cartId]
    );

    const handleRemoveCoupon = useCallback(
        async couponCode => {
            try {
                await removeCoupon({
                    variables: {
                        cartId,
                        couponCode
                    }
                });
            } catch (err) {
                console.error(err);
            }
        },
        [cartId, removeCoupon]
    );

    useEffect(() => {
        if (cartId) {
            fetchAppliedCoupons({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchAppliedCoupons]);

    useEffect(() => {
        if (applyCouponCalled || removeCouponCalled) {
            // If a coupon mutation is in flight, tell the cart.
            setIsCartUpdating(applyingCoupon || removingCoupon);
        }
    }, [
        applyCouponCalled,
        applyingCoupon,
        removeCouponCalled,
        removingCoupon,
        setIsCartUpdating
    ]);

    let derivedErrorMessage;

    if (applyError || removeCouponError) {
        const errorTarget = applyError || removeCouponError;

        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            derivedErrorMessage = errorTarget.message;
        }
    }

    /**
     * Object type returned by the {@link useCouponCode} talon.
     * It provides props data to use when rendering a coupon code component.
     *
     * @typedef {Object} CouponCodeProps
     *
     * @property {Boolean} applyingCoupon True if a coupon is currently being applied. False otherwise.
     * @property {Object} data Data returned from the `getAppliedCouponsQuery`.
     * @property {String} errorMessage If GraphQL error occurs, this value is set.
     * @property {Object} fetchError The error data object returned by a GraphQL query.
     * @property {Function} handleApplyCoupon Function to call for handling the application of a coupon code to a cart.
     * @property {Function} handleRemoveCoupon Function to call for handling the removal of a coupon code from a cart
     * @property {Boolean} removingCoupon True if a coupon code is currently being removed. False otherwise.
     */
    return {
        applyingCoupon,
        data,
        errorMessage: derivedErrorMessage,
        fetchError,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    };
};
