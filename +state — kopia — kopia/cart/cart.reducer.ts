import {
  AddCartItemSuccessPayload,
  AddPackageSuccessPayload,
  AddToCartNotAcceptableError,
  Cart,
  CartDynamicSetAccessory,
  CartItem,
  CartItemInsurance,
  CartService,
  DeliveryDate,
  DeliveryTime,
  GetRecommendedInsurancesSuccessPayload,
  GetServicesSuccessPayload,
} from '@ems/euro-mobile/cart/domain';
import {
  DeliveryTypeEnum,
  PaymentTypeEnum,
  Shop,
} from '@ems/euro-mobile/dictionary/domain';
import { ApiError, ImageType, LocationError } from '@ems/shared/domain';
import { EncouragementInsurance } from '@ems/shared/domain-openapi-contracts/insurances';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { fromCartActions } from './cart.actions';

export const CART_FEATURE_KEY = 'cart';

export type CartItemEntityState = EntityState<CartItem>;
export type CartDynamicSetAccessoryEntityState =
  EntityState<CartDynamicSetAccessory>;

export interface CartState {
  cartItemCollection: CartItemEntityState;
  cartDynamicSetAccessoryCollection: CartDynamicSetAccessoryEntityState;
  deliveryType: DeliveryTypeEnum | null;
  deliveryPrice: number;
  paymentType: PaymentTypeEnum | null;
  paymentPrice: number;
  updateDeliveryTypeLoading: boolean;
  updateDeliveryTypeError: ApiError | null;
  updatePaymentTypeLoading: boolean;
  updatePaymentTypeError: ApiError | null;
  cartLoadError: ApiError | null;
  cartLoading: boolean;
  cartCreateError: ApiError | null;
  cartCreating: boolean;
  addCartItemLoading: boolean;
  addCartItemError: ApiError | AddToCartNotAcceptableError | null;
  removeCartItemLoading: boolean;
  removeCartItemError: ApiError | null;
  shop: Shop | null;
  updateShopCodeLoading: boolean;
  updateShopCodeError: ApiError | null;
  deliveryTimeCollection: DeliveryDate[];
  deliveryTimeCollectionLoading: boolean;
  deliveryTimeCollectionLoadError: ApiError | null;
  deliveryTime: DeliveryTime | null;
  updateDeliveryTimeLoading: boolean;
  updateDeliveryTimeError: ApiError | null;
  cart: Cart | null;
  zipCode: string | null;
  updateZipCodeLoading: boolean;
  updateZipCodeError: ApiError | null;
  zipCodeSuggestion: {
    zipCode: string;
    city: string;
  } | null;
  zipCodePossibleCityCollection: string[];
  locationError: LocationError | null;
  services: GetServicesSuccessPayload[];
  recommendedInsurances: GetRecommendedInsurancesSuccessPayload | null;
  insurancesEncouragements: EncouragementInsurance | null;
  insurancesForPopUp: EncouragementInsurance | null;
  insurancesForPopUpLoaded: boolean;
  redirectToCartPayload:
    | AddCartItemSuccessPayload
    | AddPackageSuccessPayload
    | null;
}

export interface CartPartialState {
  readonly [CART_FEATURE_KEY]: CartState;
}

export const cartItemEntityAdapter: EntityAdapter<CartItem> =
  createEntityAdapter<CartItem>({
    selectId: (item) => item.identifiers.plu,
  });

export const cartDynamicSetAccessoryEntityAdapter: EntityAdapter<CartDynamicSetAccessory> =
  createEntityAdapter<CartDynamicSetAccessory>({
    selectId: (item) => item.identifier,
  });

export const cartInitialState: CartState = {
  cartItemCollection: cartItemEntityAdapter.getInitialState(),
  cartDynamicSetAccessoryCollection:
    cartDynamicSetAccessoryEntityAdapter.getInitialState(),
  deliveryType: null,
  deliveryPrice: 0,
  paymentType: null,
  paymentPrice: 0,
  updateDeliveryTypeLoading: false,
  updateDeliveryTypeError: null,
  updatePaymentTypeLoading: false,
  updatePaymentTypeError: null,
  cartLoadError: null,
  cartLoading: false,
  cartCreateError: null,
  cartCreating: false,
  addCartItemLoading: false,
  addCartItemError: null,
  removeCartItemLoading: false,
  removeCartItemError: null,
  shop: null,
  updateShopCodeLoading: false,
  updateShopCodeError: null,
  deliveryTimeCollection: [],
  deliveryTimeCollectionLoading: false,
  deliveryTimeCollectionLoadError: null,
  deliveryTime: null,
  updateDeliveryTimeLoading: false,
  updateDeliveryTimeError: null,
  cart: null,
  zipCode: null,
  updateZipCodeLoading: false,
  updateZipCodeError: null,
  zipCodeSuggestion: null,
  zipCodePossibleCityCollection: [],
  locationError: null,
  services: [],
  recommendedInsurances: null,
  insurancesEncouragements: null,
  insurancesForPopUp: null,
  insurancesForPopUpLoaded: false,
  redirectToCartPayload: null,
};

export const cartReducer = createReducer(
  cartInitialState,
  on(fromCartActions.getCart, (state) => ({
    ...state,
    cartLoading: true,
  })),
  on(fromCartActions.getCartFail, (state, { payload }) => ({
    ...state,
    cartLoading: false,
    cartLoadError: payload.error,
  })),
  on(fromCartActions.getCartSuccess, (state, { payload }) => ({
    ...state,
    cartLoading: false,
    deliveryType: payload.delivery.deliveryType
      ? payload.delivery.deliveryType
      : null,
    paymentType: payload.payment.paymentType
      ? payload.payment.paymentType
      : null,
    deliveryPrice: payload.delivery.deliveryPrice
      ? payload.delivery.deliveryPrice
      : 0,
    paymentPrice: payload.payment.paymentFee ? payload.payment.paymentFee : 0,
    cart: payload,
  })),
  on(fromCartActions.getCartItemsSuccess, (state, { payload }) => ({
    ...state,
    cartItemCollection: cartItemEntityAdapter.setAll(
      payload.items as any[],
      state.cartItemCollection,
    ),
    cartDynamicSetAccessoryCollection:
      cartDynamicSetAccessoryEntityAdapter.setAll(
        payload['dynamic-set-accessories'] as any[],
        state.cartDynamicSetAccessoryCollection,
      ),
  })),
  on(fromCartActions.createCart, (state) => ({
    ...state,
    cartCreating: true,
  })),
  on(fromCartActions.createCartFail, (state, { payload }) => ({
    ...state,
    cartCreating: false,
    cartLoading: false,
    cartCreateError: payload.error,
  })),
  on(fromCartActions.createCartSuccess, (state) => ({
    ...state,
    cartCreating: false,
    cartLoading: false,
  })),
  on(fromCartActions.addCartItem, (state, { payload }) => ({
    ...state,
    addCartItemLoading: true,
    // If cart item exist we just update it quantity otherwise we add it as new one
    cartItemCollection: state.cartItemCollection.entities[
      payload.identifiers.plu
    ]
      ? cartItemEntityAdapter.updateOne(
          {
            id: payload.identifiers.plu,
            changes: {
              quantity:
                state.cartItemCollection.entities[payload.identifiers.plu]
                  .quantity + 1,
            },
          },
          state.cartItemCollection,
        )
      : cartItemEntityAdapter.addOne(
          {
            ...payload,
            photoPath: payload.image?.find((el) => el.type === ImageType.PHOTO)
              ?.url,
            iconPhotoPath: payload.image?.find(
              (el) => el.type === ImageType.ICON_PHOTO,
            )?.url,
            quantity: 1,
            insurance: payload.insurance as any as CartItemInsurance,
            services: payload.services as any as CartService[],
          },
          state.cartItemCollection,
        ),
  })),
  on(fromCartActions.addCartItemFail, (state, { payload }) => ({
    ...state,
    addCartItemLoading: false,
    addCartItemError: payload.error,
    // If cart item existed before optimistic add we just update it quantity otherwise we remove it at all.
    cartItemCollection:
      state.cartItemCollection.entities[payload.plu].quantity > 1
        ? cartItemEntityAdapter.updateOne(
            {
              id: payload.plu,
              changes: {
                quantity:
                  state.cartItemCollection.entities[payload.plu].quantity - 1,
              },
            },
            state.cartItemCollection,
          )
        : cartItemEntityAdapter.removeOne(
            payload.plu,
            state.cartItemCollection,
          ),
  })),
  on(fromCartActions.addCartItemSuccess, (state) => ({
    ...state,
    addCartItemLoading: false,
  })),
  on(fromCartActions.updatePaymentType, (state, { payload }) => ({
    ...state,
    paymentType: payload.paymentType,
    paymentPrice: payload.paymentPrice,
    updatePaymentTypeLoading: true,
  })),
  on(fromCartActions.updatePaymentTypeSuccess, (state) => ({
    ...state,
    updatePaymentTypeLoading: false,
  })),
  on(fromCartActions.updatePaymentTypeFail, (state, { payload }) => ({
    ...state,
    paymentType: null,
    paymentPrice: 0,
    updatePaymentTypeError: payload.error,
    updatePaymentTypeLoading: false,
  })),
  on(fromCartActions.updateShopCode, (state, { payload }) => ({
    ...state,
    shop: payload.shop,
    updateShopCodeLoading: true,
  })),
  on(fromCartActions.updateShopCodeSuccess, (state) => ({
    ...state,
    updateShopCodeLoading: false,
  })),
  on(fromCartActions.updateShopCodeFail, (state, { payload }) => ({
    ...state,
    shop: null,
    updateShopCodeError: payload.error,
    updateShopCodeLoading: false,
  })),
  on(fromCartActions.getDeliveryTimeCollection, (state) => ({
    ...state,
    deliveryTimeCollectionLoading: true,
  })),
  on(
    fromCartActions.getDeliveryTimeCollectionSuccess,
    (state, { payload }) => ({
      ...state,
      deliveryTimeCollection: payload.data,
      deliveryTimeCollectionLoading: false,
    }),
  ),
  on(fromCartActions.getDeliveryTimeCollectionFail, (state, { payload }) => ({
    ...state,
    deliveryTimeCollectionLoadError: payload.error,
    deliveryTimeCollectionLoading: false,
  })),

  on(fromCartActions.updateDeliveryTime, (state, { payload }) => ({
    ...state,
    deliveryTime: payload.deliveryTime,
    updateDeliveryTimeLoading: true,
  })),
  on(fromCartActions.updateDeliveryTimeSuccess, (state) => ({
    ...state,
    updateDeliveryTimeLoading: false,
  })),
  on(fromCartActions.updateDeliveryTimeFail, (state, { payload }) => ({
    ...state,
    deliveryTime: null,
    updateDeliveryTimeError: payload.error,
    updateDeliveryTimeLoading: false,
  })),
  on(fromCartActions.updateZipCode, (state) => ({
    ...state,
    updateZipCodeLoading: true,
  })),
  on(fromCartActions.updateZipCodeSuccess, (state, { payload }) => ({
    ...state,
    zipCode: payload.zipCode,
    updateZipCodeLoading: false,
    updateZipCodeError: null,
    zipCodeSuggestion: null,
    zipCodePossibleCityCollection: [],
  })),
  on(fromCartActions.updateZipCodeFail, (state, { payload }) => ({
    ...state,
    zipCode: null,
    updateZipCodeError: payload.error,
    updateZipCodeLoading: false,
    zipCodeSuggestion: null,
    zipCodePossibleCityCollection: payload.error.possibleCity,
  })),
  on(fromCartActions.clearZipCodeErrorsAndSuggestion, (state) => ({
    ...state,
    updateZipCodeError: null,
    zipCodeSuggestion: null,
    locationError: null,
    zipCodePossibleCityCollection: [],
  })),
  on(fromCartActions.clearZipCode, (state) => ({
    ...state,
    updateZipCodeLoading: false,
    updateZipCodeError: null,
    zipCode: null,
    zipCodeSuggestion: null,
    zipCodePossibleCityCollection: [],
  })),
  on(fromCartActions.getZipCodeFromCoordinates, (state) => ({
    ...state,
    updateZipCodeLoading: true,
    locationError: null,
  })),
  on(
    fromCartActions.getZipCodeFromCoordinatesSuccess,
    (state, { payload }) => ({
      ...state,
      updateZipCodeLoading: false,
      zipCodeSuggestion: payload,
      locationError: null,
    }),
  ),
  on(fromCartActions.getZipCodeFromCoordinatesFail, (state, { payload }) => ({
    ...state,
    updateZipCodeLoading: false,
    zipCodeSuggestion: null,
    locationError: payload.error,
  })),
  on(fromCartActions.getServicesSuccess, (state, { payload }) => ({
    ...state,
    services: payload,
  })),
  on(fromCartActions.getRecommendedInsurances, (state) => ({
    ...state,
    recommendedInsurances: null,
  })),
  on(fromCartActions.getRecommendedInsurancesSuccess, (state, { payload }) => ({
    ...state,
    recommendedInsurances: payload,
  })),
  on(fromCartActions.getInsurancesEncouragementsFail, (state) => ({
    ...state,
    insurancesEncouragements: null,
  })),
  on(
    fromCartActions.getInsurancesEncouragementsSuccess,
    (state, { payload }) => ({
      ...state,
      insurancesEncouragements: payload,
    }),
  ),
  on(
    fromCartActions.getProductInsurancesEncouragementsForCart,
    fromCartActions.getSetInsurancesEncouragementsForCart,
    (state) => ({
      ...state,
      insurancesForPopUpLoaded: false,
      insurancesForPopUp: null,
      redirectToCartPayload: null,
    }),
  ),
  on(
    fromCartActions.getSetInsurancesEncouragementsForCartSuccess,
    fromCartActions.getProductInsurancesEncouragementsForCartSuccess,
    (state, { payload }) => ({
      ...state,
      insurancesForPopUp: payload.insurancesEncouragements,
      insurancesForPopUpLoaded: true,
      redirectToCartPayload: payload.redirectToCartPayload,
    }),
  ),
  on(fromCartActions.redirectToCart, (state) => ({
    ...state,
    insurancesForPopUp: null,
    insurancesForPopUpLoaded: false,
    redirectToCartPayload: null,
  })),
);

export const { selectAll, selectTotal } = cartItemEntityAdapter.getSelectors();
export const { selectAll: selectAllDynamicAccessories } =
  cartDynamicSetAccessoryEntityAdapter.getSelectors();
