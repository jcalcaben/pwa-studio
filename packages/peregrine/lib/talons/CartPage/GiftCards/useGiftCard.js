import { useCallback } from 'react';

/**
 * Provide logic for a single gift card component.
 * 
 * @function
 * 
 * @param {Object} props
 * @param {String} props.code Gift card's code
 * @param {Function} props.removeGiftCard A function that removes a gift card when provided a code
 * 
 * @return {GiftCardProps}
 * 
 * @example <caption>Importing into your project</caption>
 * import { useGiftCard } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCard';
 */
export const useGiftCard = props => {
    const { code, removeGiftCard } = props;

    const removeGiftCardWithCode = useCallback(() => {
        removeGiftCard(code);
    }, [code, removeGiftCard]);

    /**
     * Props data to use when rendering a single gift card component.
     * @typedef {Object} GiftCardProps
     * 
     * @property {Function} removeGiftCardWithCode Function for removing a gift card associated with the code passed into this talon.
     */
    return {
        removeGiftCardWithCode
    };
};
