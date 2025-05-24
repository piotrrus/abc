import { createSelector } from '@ngrx/store';
import { cartQuery } from '../cart/cart.selectors';
import { cartSettingsQuery } from '../cart-settings/cart-settings.selectors';
import { CartItem } from '@ems/euro-mobile/cart/domain';

const isCartItemLimitAcquired = createSelector(
  cartQuery.getCartItemCollectionTotal,
  cartSettingsQuery.getCartItemLimit,
  (cartItems: number, ruleValue: number) => cartItems >= ruleValue
);

const isCartItemQuantityLimitAcquiredMap = createSelector(
  cartQuery.getCartItemCollection,
  cartSettingsQuery.getCartItemQuantityLimit,
  (cartItems: CartItem[], ruleValue: number) =>
    cartItems.reduce((map, cartItem) => {
      map[cartItem.identifiers.plu] = cartItem.quantity >= +ruleValue;
      return map;
    }, {})
);

const isCartItemQuantityLimitAcquired = (plu: string) =>
  createSelector(
    isCartItemQuantityLimitAcquiredMap,
    (cartItemQuantityLimitAcquiredMap: Record<string, boolean>) =>
      cartItemQuantityLimitAcquiredMap[plu]
  );

const isCartItemInTheCart = (plu: string) =>
  createSelector(cartQuery.getCartItemCollection, (cartItems: CartItem[]) =>
    cartItems.some((item) => item.identifiers.plu === plu)
  );

const isOutletCopyInTheCart = (huCode: string) =>
  createSelector(cartQuery.getCartItemCollection, (cartItems: CartItem[]) =>
    cartItems.some((item) => item.identifiers.huCode === huCode)
  );

export const cartValidatorsQuery = {
  isCartItemLimitAcquired,
  isCartItemQuantityLimitAcquiredMap,
  isCartItemQuantityLimitAcquired,
  isCartItemInTheCart,
  isOutletCopyInTheCart,
};
