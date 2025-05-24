import { fromCartSettingsActions } from './cart-settings.actions';
import {
  CartSettingsState,
  cartSettingsInitialState,
  cartSettingsReducer,
} from './cart-settings.reducer';
import { statesEqual } from '@valueadd/testing';
import { CartRestriction, CartSettings } from '@ems/euro-mobile/cart/domain';

describe('CartSettings Reducer', () => {
  let state: CartSettingsState;

  beforeEach(() => {
    state = { ...cartSettingsInitialState };
  });

  describe('getCartSettingsCollection', () => {
    test('sets cartSettingsCollection, cartSettingsCollectionLoading, cartSettingsCollectionLoadError and does not modify other state properties', () => {
      const action = fromCartSettingsActions.getCartSettingsCollection();
      const result = cartSettingsReducer(state, action);

      expect(result.cartSettingsCollection).toEqual([]);
      expect(result.cartSettingsCollectionLoading).toEqual(true);
      expect(result.cartSettingsCollectionLoadError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'cartSettingsCollection',
          'cartSettingsCollectionLoading',
          'cartSettingsCollectionLoadError',
        ])
      ).toBeTruthy();
    });
  });

  describe('getCartSettingsCollectionFail', () => {
    test('sets cartSettingsCollection, cartSettingsCollectionLoading, cartSettingsCollectionLoadError and does not modify other state properties', () => {
      const payload = {
        error: '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      const action = fromCartSettingsActions.getCartSettingsCollectionFail({
        payload,
      });
      const result = cartSettingsReducer(state, action);

      expect(result.cartSettingsCollection).toEqual([]);
      expect(result.cartSettingsCollectionLoading).toEqual(false);
      expect(result.cartSettingsCollectionLoadError).toEqual(payload.error);
      expect(
        statesEqual(result, state, [
          'cartSettingsCollection',
          'cartSettingsCollectionLoading',
          'cartSettingsCollectionLoadError',
        ])
      ).toBeTruthy();
    });
  });

  describe('getCartSettingsCollectionSuccess', () => {
    const cartSettingsCollection = [
      {
        ruleID: CartRestriction.CART_ITEMS_LIMIT,
        value: 15,
        errorText: 'Przekroczyłeś maksymalną ilość różnych produktów w koszyku',
      },
      {
        ruleID: CartRestriction.CART_ITEM_QUANTITY_LIMIT,
        value: 2,
        errorText:
          'Przekroczyłeś maksymalną ilość produktów tego samego typu w koszyku',
      },
    ] as CartSettings[];

    test('sets cartSettingsCollection, cartSettingsCollectionLoading, cartSettingsCollectionLoadError and does not modify other state properties', () => {
      const action = fromCartSettingsActions.getCartSettingsCollectionSuccess({
        payload: {
          cartSettingsCollection,
        },
      });
      const result = cartSettingsReducer(state, action);

      expect(result.cartSettingsCollection).toEqual(cartSettingsCollection);
      expect(result.cartSettingsCollectionLoading).toEqual(false);
      expect(result.cartSettingsCollectionLoadError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'cartSettingsCollection',
          'cartSettingsCollectionLoading',
          'cartSettingsCollectionLoadError',
        ])
      ).toBeTruthy();
    });
  });
});
