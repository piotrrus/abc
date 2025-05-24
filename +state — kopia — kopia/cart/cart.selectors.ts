import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CartState,
  CART_FEATURE_KEY,
  selectAll,
  selectAllDynamicAccessories,
  selectTotal,
} from './cart.reducer';

// Lookup the 'Cart' feature state managed by NgRx
const getCartState = createFeatureSelector<CartState>(CART_FEATURE_KEY);

const getCartEntityState = createSelector(
  getCartState,
  (state) => state.cartItemCollection
);

const getCartDynamicSetAccessoryEntityState = createSelector(
  getCartState,
  (state) => state.cartDynamicSetAccessoryCollection
);

const getCartItemCollection = createSelector(getCartEntityState, selectAll);

const getCartDynamicSetAccessoryCollection = createSelector(
  getCartDynamicSetAccessoryEntityState,
  selectAllDynamicAccessories
);

const getCartItemsQuantity = createSelector(
  getCartItemCollection,
  getCartDynamicSetAccessoryCollection,
  (cartItemCollection, cartDynamicSetAccessoryCollection) =>
    cartItemCollection.reduce(
      (summaryQuantity, cartItem) => summaryQuantity + cartItem.quantity,
      0
    ) +
    cartDynamicSetAccessoryCollection.reduce(
      (summaryQuantity, dynamicSetAccessory) =>
        summaryQuantity +
        dynamicSetAccessory.quantity +
        dynamicSetAccessory.elements.reduce(
          (sumQuantity, dynamicSetAccessoryElement) =>
            sumQuantity + dynamicSetAccessoryElement.quantity,
          0
        ),
      0
    )
);

const getCartItemCollectionTotal = createSelector(
  getCartEntityState,
  selectTotal
);

const getCart = createSelector(getCartState, (state) => state.cart);

const getDeliveryType = createSelector(
  getCartState,
  (state) => state.deliveryType
);

const getPaymentType = createSelector(
  getCartState,
  (state) => state.paymentType
);

const getDeliveryPrice = createSelector(
  getCartState,
  (state) => state.deliveryPrice
);

const getPaymentPrice = createSelector(
  getCartState,
  (state) => state.paymentPrice
);

const getCartLoading = createSelector(
  getCartState,
  (state) => state.cartLoading
);

const getCartLoadError = createSelector(
  getCartState,
  (state) => state.cartLoadError
);

const getCartCreating = createSelector(
  getCartState,
  (state) => state.cartCreating
);

const getCartCreateError = createSelector(
  getCartState,
  (state) => state.cartCreateError
);

const getAddCartItemLoading = createSelector(
  getCartState,
  (state) => state.addCartItemLoading
);

const getAddCartItemError = createSelector(
  getCartState,
  (state) => state.addCartItemError
);

const getRemoveCartItemLoading = createSelector(
  getCartState,
  (state) => state.removeCartItemLoading
);

const getRemoveCartItemError = createSelector(
  getCartState,
  (state) => state.removeCartItemError
);

const getCartValue = createSelector(
  getCartItemCollection,
  getCartDynamicSetAccessoryCollection,
  (cartItems, dynamicSetAccessories) => {
    const cartItemsPrice = cartItems.reduce((currentPrice, cartItem) => {
      const servicesPrice =
        cartItem.services?.reduce(
          (currPrice, currService) =>
            currPrice + currService.quantity * currService.price,
          0
        ) || 0;

      return currentPrice + cartItem.quantity * cartItem.price + servicesPrice;
    }, 0);
    const dynamicSetAccessoriesPrice = dynamicSetAccessories.reduce(
      (currentPrice, dynamicSetAccessory) => {
        return (
          currentPrice +
          dynamicSetAccessory.quantity * dynamicSetAccessory.price
        );
      },
      0
    );
    return cartItemsPrice + dynamicSetAccessoriesPrice;
  }
);

const getUpdatePaymentTypeLoading = createSelector(
  getCartState,
  (state) => state.updatePaymentTypeLoading
);

const getUpdatePaymentTypeError = createSelector(
  getCartState,
  (state) => state.updatePaymentTypeError
);

const getUpdateDeliveryTypeLoading = createSelector(
  getCartState,
  (state) => state.updateDeliveryTypeLoading
);

const getUpdateDeliveryTypeError = createSelector(
  getCartState,
  (state) => state.updateDeliveryTypeError
);

const getShop = createSelector(getCartState, (state) => state.shop);

const getUpdateShopCodeLoading = createSelector(
  getCartState,
  (state) => state.updateShopCodeLoading
);

const getUpdateShopCodeError = createSelector(
  getCartState,
  (state) => state.updateShopCodeError
);

const getDeliveryTimeCollection = createSelector(
  getCartState,
  (state) => state.deliveryTimeCollection
);

const getDeliveryTimeCollectionLoading = createSelector(
  getCartState,
  (state) => state.deliveryTimeCollectionLoading
);

const getDeliveryTimeCollectionError = createSelector(
  getCartState,
  (state) => state.deliveryTimeCollectionLoadError
);

const getDeliveryTime = createSelector(
  getCartState,
  (state) => state.deliveryTime
);

const getUpdateDeliveryTimeLoading = createSelector(
  getCartState,
  (state) => state.updateDeliveryTimeLoading
);

const getUpdateDeliveryTimeError = createSelector(
  getCartState,
  (state) => state.updateDeliveryTimeError
);

const getCartItems = createSelector(
  getCartState,
  getCartItemCollection,
  (state, collection) => {
    const items = [];
    collection.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        items.push(item);
      }
    });
    return items;
  }
);

const getZipCode = createSelector(getCartState, (state) => {
  return state.zipCode;
});

const getUpdateZipCodeLoading = createSelector(
  getCartState,
  (state) => state.updateZipCodeLoading
);

const getUpdateZipCodeError = createSelector(
  getCartState,
  (state) => state.updateZipCodeError
);

const getFinalDeliveryPrice = createSelector(
  getDeliveryPrice,
  getDeliveryTime,
  (deliveryPrice, deliveryTime) =>
    deliveryPrice + deliveryTime?.hours.deliveryHoursPrice
);

const getZipCodeSuggestion = createSelector(
  getCartState,
  (state) => state.zipCodeSuggestion
);

const getZipCodePossibleCityCollection = createSelector(
  getCartState,
  (state: CartState) => state.zipCodePossibleCityCollection
);

const getLocationError = createSelector(
  getCartState,
  (state) => state.locationError
);

const getServices = createSelector(getCartState, (state) => state.services);

const getRecommendedInsurances = createSelector(
  getCartState,
  (state) => state.recommendedInsurances
);

const getInsurancesEncouragements = createSelector(
  getCartState,
  (state) => state.insurancesEncouragements
);

const getInsurancesForPopUp = createSelector(
  getCartState,
  (state) => state.insurancesForPopUp
);

const getInsurancesForPopUpLoaded = createSelector(
  getCartState,
  (state) => state.insurancesForPopUpLoaded
);

const getRedirectToCartPayload = createSelector(
  getCartState,
  (state) => state.redirectToCartPayload
);

export const cartQuery = {
  getCartItemCollection,
  getCartItemCollectionTotal,
  getDeliveryType,
  getPaymentType,
  getDeliveryPrice,
  getPaymentPrice,
  getCartLoading,
  getCartLoadError,
  getCartCreating,
  getCartCreateError,
  getAddCartItemLoading,
  getAddCartItemError,
  getRemoveCartItemError,
  getRemoveCartItemLoading,
  getCartValue,
  getCartItemsQuantity,
  getUpdatePaymentTypeLoading,
  getUpdatePaymentTypeError,
  getUpdateDeliveryTypeLoading,
  getUpdateDeliveryTypeError,
  getShop,
  getCart,
  getUpdateShopCodeError,
  getUpdateShopCodeLoading,
  getDeliveryTimeCollection,
  getDeliveryTimeCollectionLoading,
  getDeliveryTimeCollectionError,
  getDeliveryTime,
  getUpdateDeliveryTimeLoading,
  getUpdateDeliveryTimeError,
  getCartItems,
  getZipCode,
  getUpdateZipCodeError,
  getUpdateZipCodeLoading,
  getZipCodeSuggestion,
  getZipCodePossibleCityCollection,
  getLocationError,
  getFinalDeliveryPrice,
  getServices,
  getRecommendedInsurances,
  getInsurancesEncouragements,
  getInsurancesForPopUp,
  getInsurancesForPopUpLoaded,
  getRedirectToCartPayload,
};
