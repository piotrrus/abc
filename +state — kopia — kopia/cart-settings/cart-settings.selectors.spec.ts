import {
  cartSettingsInitialState,
  CART_SETTINGS_FEATURE_KEY,
  CartSettingsState,
} from './cart-settings.reducer';
import { cartSettingsQuery } from './cart-settings.selectors';
import { CartRestriction } from '@ems/euro-mobile/cart/domain';
describe('CartSettings Selectors', () => {
  let storeState: { [CART_SETTINGS_FEATURE_KEY]: CartSettingsState };

  beforeEach(() => {
    storeState = {
      [CART_SETTINGS_FEATURE_KEY]: cartSettingsInitialState,
    };
  });

  test('getCartSettingsCollectionLoading() returns cartSettingsCollectionLoading value', () => {
    const result =
      cartSettingsQuery.getCartSettingsCollectionLoading(storeState);

    expect(result).toBe(
      storeState[CART_SETTINGS_FEATURE_KEY].cartSettingsCollectionLoading
    );
  });

  test('getCartSettingsCollectionLoadError() returns cartSettingsCollectionLoadError value', () => {
    const result =
      cartSettingsQuery.getCartSettingsCollectionLoadError(storeState);

    expect(result).toBe(
      storeState[CART_SETTINGS_FEATURE_KEY].cartSettingsCollectionLoadError
    );
  });

  test('getCartSettingsCollection() returns cartSettingsCollection value', () => {
    const result = cartSettingsQuery.getCartSettingsCollection(storeState);

    expect(result).toBe(
      storeState[CART_SETTINGS_FEATURE_KEY].cartSettingsCollection
    );
  });

  // @todo
  // describe('isCartItemQuantityLimitAcquired', () => {
  //   beforeEach(() => {
  //     storeState = {
  //       [CART_SETTINGS_FEATURE_KEY]: {
  //         ...cartSettingsInitialState,
  //         cartSettingsCollection: [
  //           {
  //             ruleID: CartRestriction.CART_ITEM_QUANTITY_LIMIT,
  //             value: 2,
  //             errorText: '',
  //           },
  //         ],
  //       },
  //     };
  //   });

  //   test('getCartItemQuantityLimit() returns limit value', () => {
  //     const result = cartSettingsQuery.getCartItemQuantityLimit(storeState);

  //     expect(result).toBe(2);
  //   });
  // });

  describe('getCartItemLimit', () => {
    beforeEach(() => {
      storeState = {
        [CART_SETTINGS_FEATURE_KEY]: {
          ...cartSettingsInitialState,
          cartSettingsCollection: [
            {
              ruleID: CartRestriction.CART_ITEMS_LIMIT,
              value: 15,
              errorText: '',
            },
          ],
        },
      };
    });

    test('getCartItemLimit() returns limit value', () => {
      const result = cartSettingsQuery.getCartItemLimit(storeState);
      expect(result).toBe(15);
    });
  });
});
