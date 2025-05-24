import { fromCartSettingsActions } from './cart-settings.actions';
import { CartSettings } from '@ems/euro-mobile/cart/domain';
import { createReducer, on } from '@ngrx/store';
import { ApiError } from '@ems/shared/domain';

export const CART_SETTINGS_FEATURE_KEY = 'cartSettings';

export interface CartSettingsState {
  cartSettingsCollectionLoading: boolean;
  cartSettingsCollectionLoadError: ApiError | null;
  cartSettingsCollection: CartSettings[];
}

export interface CartSettingsPartialState {
  readonly [CART_SETTINGS_FEATURE_KEY]: CartSettingsState;
}

export const cartSettingsInitialState: CartSettingsState = {
  cartSettingsCollection: [],
  cartSettingsCollectionLoading: false,
  cartSettingsCollectionLoadError: null,
};

export const cartSettingsReducer = createReducer(
  cartSettingsInitialState,
  on(
    fromCartSettingsActions.getCartSettingsCollection,
    (state: CartSettingsState) => ({
      ...state,
      cartSettingsCollectionLoading: true,
      cartSettingsCollectionLoadError: null,
    })
  ),
  on(
    fromCartSettingsActions.getCartSettingsCollectionSuccess,
    (state, { payload }) => ({
      ...state,
      cartSettingsCollection: payload.cartSettingsCollection,
      cartSettingsCollectionLoading: false,
      cartSettingsCollectionLoadError: null,
    })
  ),
  on(
    fromCartSettingsActions.getCartSettingsCollectionFail,
    (state, { payload }) => ({
      ...state,
      cartSettingsCollectionLoading: false,
      cartSettingsCollectionLoadError: payload.error,
    })
  )
);
