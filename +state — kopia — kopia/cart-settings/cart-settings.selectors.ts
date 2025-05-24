import { CartRestriction, CartSettings } from '@ems/euro-mobile/cart/domain';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CART_SETTINGS_FEATURE_KEY,
  CartSettingsState,
} from './cart-settings.reducer';

// Lookup the 'CartSettings' feature state managed by NgRx
const getCartSettingsState = createFeatureSelector<CartSettingsState>(
  CART_SETTINGS_FEATURE_KEY
);

const getCartSettingsCollection = createSelector(
  getCartSettingsState,
  (state) => state.cartSettingsCollection
);

const getCartSettingsCollectionLoadError = createSelector(
  getCartSettingsState,
  (state) => state.cartSettingsCollectionLoadError
);

const getCartSettingsCollectionLoading = createSelector(
  getCartSettingsState,
  (state) => state.cartSettingsCollectionLoading
);

const getCartItemQuantityLimit = createSelector(
  getCartSettingsState,
  (state) => {
    const currentRule: CartSettings | undefined =
      state.cartSettingsCollection.find(
        (rule) => rule.ruleID === CartRestriction.CART_ITEM_QUANTITY_LIMIT
      );

    // @todo no cart settigns in franke
    return 3;
    // return currentRule ? currentRule.value : Number.MAX_VALUE;
  }
);

const getCartItemQuantityLimitError = createSelector(
  getCartSettingsState,
  (state) => {
    const currentRule: CartSettings | undefined =
      state.cartSettingsCollection.find(
        (rule) => rule.ruleID === CartRestriction.CART_ITEM_QUANTITY_LIMIT
      );

    // @todo no cart settigns in franke
    return '';
    // return currentRule.errorText;
  }
);

const getCartItemLimit = createSelector(getCartSettingsState, (state) => {
  const currentRule: CartSettings | undefined =
    state.cartSettingsCollection.find(
      (rule) => rule.ruleID === CartRestriction.CART_ITEMS_LIMIT
    );
  return currentRule ? currentRule.value : Number.MAX_VALUE;
});

const getCartItemLimitError = createSelector(getCartSettingsState, (state) => {
  const currentRule: CartSettings | undefined =
    state.cartSettingsCollection.find(
      (rule) => rule.ruleID === CartRestriction.CART_ITEMS_LIMIT
    );

  // @todo
  return '';
  // return currentRule.errorText;
});

export const cartSettingsQuery = {
  getCartSettingsCollection,
  getCartSettingsCollectionLoadError,
  getCartSettingsCollectionLoading,
  getCartItemQuantityLimit,
  getCartItemLimit,
  getCartItemQuantityLimitError,
  getCartItemLimitError,
};
