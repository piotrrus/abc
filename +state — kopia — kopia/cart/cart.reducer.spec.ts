import {
  AddCartItemPayload,
  Cart,
  CartDynamicSetAccessory,
  CartItem,
  CartItems,
  GetDeliveryTimeCollectionSuccessPayload,
  GetRecommendedInsurancesSuccessPayload,
  GetServicesSuccessPayload,
  GetZipCodeFromCoordinatesFailPayload,
  GetZipCodeFromCoordinatesSuccessPayload,
  UpdateDeliveryTimePayload,
  UpdatePaymentTypePayload,
  UpdateShopCodePayload,
  UpdateZipCodeFailPayload,
  UpdateZipCodePayload,
} from '@ems/euro-mobile/cart/domain';
import { PaymentTypeEnum, Shop } from '@ems/euro-mobile/dictionary/domain';
import { ApiError, ImageType, LocationError } from '@ems/shared/domain';
import { GetInsurancesRecommendedRequestParams } from '@ems/shared/domain-openapi-contracts/insurances';
import { statesEqual } from '@valueadd/testing';
import { fromCartActions } from './cart.actions';
import { CartState, cartInitialState, cartReducer } from './cart.reducer';

const cartItemCollectionMock = {
  ids: ['1187026'],
  entities: {
    '1187026': {
      name: 'Whirlpool W7 921O K AQUA',
      photoPath: 'string',
      iconPhotoPath: 'string',
      price: 1899,
      quantity: 1,
      identifiers: {
        plu: '1187026',
        productLinkName: undefined,
        productGroupLinkName: undefined,
      },
    },
  },
};

describe('Cart Reducer', () => {
  let state: CartState;

  beforeEach(() => {
    state = { ...cartInitialState };
  });

  describe('unknown action', () => {
    test('returns the initial state', () => {
      const action = {} as never;
      const result = cartReducer(state, action);

      expect(result).toBe(state);
    });
  });

  describe('getCart', () => {
    test('sets items, cartLoading, cartLoadError and does not modify other state properties', () => {
      const action = fromCartActions.getCart();
      const result = cartReducer(state, action);

      expect(result.cartItemCollection).toEqual({
        entities: {},
        ids: [],
      });
      expect(result.cartLoading).toEqual(true);
      expect(result.cartLoadError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'cartItemCollection',
          'cartLoading',
          'cartLoadError',
        ]),
      ).toBeTruthy();
    });
  });

  describe('getCartFail', () => {
    test('sets items, cartLoading, cartLoadError and does not modify other state properties', () => {
      const payload = {
        error: '',
      } as any;
      const action = fromCartActions.getCartFail({ payload });
      const result = cartReducer(state, action);

      expect(result.cartItemCollection).toEqual({
        entities: {},
        ids: [],
      });
      expect(result.cartLoading).toEqual(false);
      expect(result.cartLoadError).toEqual(payload.error);
      expect(
        statesEqual(result, state, [
          'cartItemCollection',
          'cartLoading',
          'cartLoadError',
        ]),
      ).toBeTruthy();
    });
  });

  describe('getCartSuccess', () => {
    test('sets items, cartLoading, cartLoadError and does not modify other state properties', () => {
      const products = [{ plu: '1234' }] as unknown[];
      const payload = {
        products,
        delivery: {
          deliveryPrice: 10,
        },
        payment: {
          paymentFee: 10,
        },
      } as Cart;
      const action = fromCartActions.getCartSuccess({
        payload,
      });
      const result = cartReducer(state, action);

      expect(result.cartLoading).toEqual(false);
      expect(result.cartLoadError).toEqual(null);
      expect(result.deliveryPrice).toEqual(payload.delivery.deliveryPrice);
      expect(result.paymentPrice).toEqual(payload.payment.paymentFee);
      expect(
        statesEqual(result, state, [
          'cartLoading',
          'cartLoadError',
          'cart',
          'deliveryPrice',
          'paymentPrice',
        ]),
      ).toBeTruthy();
    });

    test('sets items, cartLoading, cartLoadError and does not modify other state properties', () => {
      const products = [{ plu: '1234' }] as unknown[];
      const payload = {
        products,
        delivery: {
          deliveryDate: '',
        },
        payment: {
          paymentType: PaymentTypeEnum.BLIK,
        },
      } as Cart;
      const action = fromCartActions.getCartSuccess({
        payload,
      });
      const result = cartReducer(state, action);

      expect(result.cartLoading).toEqual(false);
      expect(result.cartLoadError).toEqual(null);
      expect(result.deliveryPrice).toEqual(0);
      expect(result.paymentPrice).toEqual(0);
      expect(
        statesEqual(result, state, [
          'cartLoading',
          'cartLoadError',
          'cart',
          'deliveryPrice',
          'paymentPrice',
          'paymentType',
        ]),
      ).toBeTruthy();
    });
  });

  describe('getCartItemsSuccess', () => {
    test('update cartItemCollection and does not modify other state properties', () => {
      const items = [
        {
          identifiers: {
            plu: '1234',
          },
        },
      ] as CartItem[];
      const dynamicSetAccessoriesData = {
        'dynamic-set-accessories': [
          {
            identifier: '2345',
          },
        ] as CartDynamicSetAccessory[],
      };
      const payload = {
        items,
        ...dynamicSetAccessoriesData,
      } as CartItems;
      const action = fromCartActions.getCartItemsSuccess({
        payload,
      });
      const result = cartReducer(state, action);

      expect(result.cartItemCollection).toEqual({
        entities: { ['1234']: items[0] },
        ids: ['1234'],
      });

      expect(result.cartDynamicSetAccessoryCollection).toEqual({
        entities: {
          ['2345']: dynamicSetAccessoriesData['dynamic-set-accessories'][0],
        },
        ids: ['2345'],
      });
      expect(
        statesEqual(result, state, [
          'cartItemCollection',
          'cartDynamicSetAccessoryCollection',
        ]),
      ).toBeTruthy();
    });
  });

  describe('createCart', () => {
    test('sets cartCreating, cartCreateError and does not modify other state properties', () => {
      const action = fromCartActions.createCart();
      const result = cartReducer(state, action);

      expect(result.cartCreating).toEqual(true);
      expect(result.cartCreateError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'cartItemCollection',
          'cartCreating',
          'cartCreateError',
        ]),
      ).toBeTruthy();
    });
  });

  describe('createCartFail', () => {
    test('sets cartLoading, cartCreating, cartCreateError and does not modify other state properties', () => {
      const payload = {
        error: '',
      } as any;
      const action = fromCartActions.createCartFail({ payload });
      const result = cartReducer(state, action);

      expect(result.cartLoading).toEqual(false);
      expect(result.cartCreating).toEqual(false);
      expect(result.cartCreateError).toEqual(payload.error);
      expect(
        statesEqual(result, state, [
          'cartLoading',
          'cartCreating',
          'cartCreateError',
        ]),
      ).toBeTruthy();
    });
  });

  describe('createCartSuccess', () => {
    test('sets cartLoading, cartCreating, cartCreateError and does not modify other state properties', () => {
      const action = fromCartActions.createCartSuccess({
        payload: { cartId: 'a' },
      });
      const result = cartReducer(state, action);

      expect(result.cartLoading).toEqual(false);
      expect(result.cartCreating).toEqual(false);
      expect(result.cartCreateError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'cartItemCollection',
          'cartCreating',
          'cartCreateError',
        ]),
      ).toBeTruthy();
    });
  });

  describe('addCartItem', () => {
    test('sets addCartItemLoading, addCartItemError and increase existing cart item and does not modify other state properties', () => {
      const payload: AddCartItemPayload = {
        identifiers: {
          plu: '1187026',
          productLinkName: undefined,
          productGroupLinkName: undefined,
        },
        price: 1899,
        image: [],
        name: 'Whirlpool W7 921O K AQUA',
        productName: 'pralka',
        productGroup: 'Lodówki',
        productNumber: '1',
        services: [],
      };
      const action = fromCartActions.addCartItem({ payload });
      const result = cartReducer(
        { ...state, cartItemCollection: cartItemCollectionMock },
        action,
      );

      expect(result.addCartItemLoading).toEqual(true);
      expect(result.addCartItemError).toEqual(null);
      expect(
        result.cartItemCollection.entities[payload.identifiers.plu].quantity,
      ).toBe(2);
      expect(
        statesEqual(result, state, [
          'addCartItemLoading',
          'addCartItemError',
          'cartItemCollection',
        ]),
      ).toBeTruthy();
    });

    test('sets addCartItemLoading, addCartItemError and add new cart item and does not modify other state properties', () => {
      const payload: AddCartItemPayload = {
        identifiers: {
          plu: '1187026',
          productLinkName: undefined,
          productGroupLinkName: undefined,
        },
        price: 1899,
        image: [
          { type: ImageType.PHOTO, url: '' },
          { type: ImageType.ICON_PHOTO, url: '' },
        ],
        name: 'Whirlpool W7 921O K AQUA',
        productName: 'pralka',
        productGroup: 'Lodówki',
        productNumber: '1',
        services: [],
      };
      const action = fromCartActions.addCartItem({ payload });
      const result = cartReducer(
        { ...state, cartItemCollection: cartItemCollectionMock },
        action,
      );

      expect(result.addCartItemLoading).toEqual(true);
      expect(result.addCartItemError).toEqual(null);
      expect(
        result.cartItemCollection.entities[payload.identifiers.plu],
      ).toEqual({
        identifiers: {
          plu: '1187026',
          productGroupLinkName: undefined,
          productLinkName: undefined,
        },
        name: 'Whirlpool W7 921O K AQUA',
        photoPath: 'string',
        iconPhotoPath: 'string',
        price: 1899,
        quantity: 2,
      });
      expect(
        statesEqual(result, state, [
          'addCartItemLoading',
          'addCartItemError',
          'cartItemCollection',
        ]),
      ).toBeTruthy();
    });

    test('set new cartItem in cartItemCollection and add new cart item and does not modify other state properties', () => {
      const payload: AddCartItemPayload = {
        identifiers: {
          plu: '2287026',
          productLinkName: undefined,
          productGroupLinkName: undefined,
        },
        price: 2222,
        image: [
          { type: ImageType.PHOTO, url: 'photo_url' },
          { type: ImageType.ICON_PHOTO, url: 'icon_photo_url' },
        ],
        name: 'Whirlpool W7 Second CartItem',
        productName: 'pralka',
        productGroup: 'Lodówki',
        productNumber: '1',
        services: [],
      };
      const action = fromCartActions.addCartItem({ payload });
      const result = cartReducer(
        { ...state, cartItemCollection: cartItemCollectionMock },
        action,
      );

      expect(result.addCartItemLoading).toEqual(true);
      expect(result.addCartItemError).toEqual(null);
      expect(
        result.cartItemCollection.entities[payload.identifiers.plu],
      ).toEqual({
        image: [
          { type: ImageType.PHOTO, url: 'photo_url' },
          { type: ImageType.ICON_PHOTO, url: 'icon_photo_url' },
        ],
        name: 'Whirlpool W7 Second CartItem',
        productName: 'pralka',
        productGroup: 'Lodówki',
        productNumber: '1',
        photoPath: 'photo_url',
        iconPhotoPath: 'icon_photo_url',
        price: 2222,
        quantity: 1,
        services: [],
        identifiers: {
          plu: '2287026',
          productGroupLinkName: undefined,
          productLinkName: undefined,
        },
      });
      expect(
        statesEqual(result, state, [
          'addCartItemLoading',
          'addCartItemError',
          'cartItemCollection',
        ]),
      ).toBeTruthy();
    });
  });

  describe('addCartItemFail', () => {
    test('sets addCartItemLoading, addCartItemError and remove cart item with quantity = 1 and does not modify other state properties', () => {
      const payload = {
        error: {} as ApiError,
        plu: '1187026',
        productName: 'pralka',
      };

      const action = fromCartActions.addCartItemFail({ payload });
      const result = cartReducer(
        { ...state, cartItemCollection: cartItemCollectionMock },
        action,
      );

      expect(result.addCartItemLoading).toEqual(false);
      expect(result.addCartItemError).toEqual(payload.error);
      expect(result.cartItemCollection.entities['1187026']).toEqual(undefined);
      expect(
        statesEqual(result, state, [
          'addCartItemLoading',
          'addCartItemError',
          'cartItemCollection',
        ]),
      ).toBeTruthy();
    });

    test('sets addCartItemLoading, addCartItemError and decrease cart item with quantity > 1 and does not modify other state properties', () => {
      const payload = {
        error: {} as ApiError,
        plu: '1187026',
        productName: 'pralka',
      };

      const action = fromCartActions.addCartItemFail({ payload });
      const result = cartReducer(
        {
          ...state,
          cartItemCollection: {
            ...cartItemCollectionMock,
            entities: {
              '1187026': {
                ...cartItemCollectionMock.entities['1187026'],
                quantity: 2,
              },
            },
          },
        },
        action,
      );

      expect(result.addCartItemLoading).toEqual(false);
      expect(result.addCartItemError).toEqual(payload.error);
      expect(result.cartItemCollection.entities['1187026'].quantity).toEqual(1);
      expect(
        statesEqual(result, state, [
          'addCartItemLoading',
          'addCartItemError',
          'cartItemCollection',
        ]),
      ).toBeTruthy();
    });
  });

  describe('addCartItemSuccess', () => {
    test('sets addCartItemLoading and does not modify other state properties', () => {
      const action = fromCartActions.addCartItemSuccess({
        payload: {
          productPlu: '',
          accessoriesToCartAvailable: true,
          insuranceEncouragementAvailable: true,
          messageForUser: '',
          productLinkName: '',
        },
      });
      const result = cartReducer(state, action);

      expect(result.addCartItemLoading).toEqual(false);
      expect(statesEqual(result, state, ['addCartItemLoading'])).toBeTruthy();
    });
  });

  describe('paymentType', () => {
    test('sets updatePaymentTypeLoading, updatePaymentTypeError sets payment type does not modify other state properties', () => {
      const payload: UpdatePaymentTypePayload = {
        paymentType: PaymentTypeEnum.SHOP,
        paymentPrice: 10,
      };
      const action = fromCartActions.updatePaymentType({ payload });
      const result = cartReducer(
        { ...state, paymentType: payload.paymentType },
        action,
      );

      expect(result.updatePaymentTypeLoading).toEqual(true);
      expect(result.updatePaymentTypeError).toEqual(null);
      expect(result.paymentType).toEqual(payload.paymentType);
      expect(result.paymentPrice).toEqual(payload.paymentPrice);
      expect(
        statesEqual(result, state, [
          'updatePaymentTypeLoading',
          'updatePaymentTypeError',
          'paymentType',
          'paymentPrice',
        ]),
      ).toBeTruthy();
    });
  });

  describe('updatePaymentTypeFail', () => {
    test('sets updatePaymentTypeLoading, updatePaymentTypeError, unset the payment type and does not modify other state properties', () => {
      const payload = {
        error: {} as ApiError,
        paymentType: null,
      };

      const action = fromCartActions.updatePaymentTypeFail({ payload });
      const result = cartReducer(state, action);

      expect(result.updatePaymentTypeLoading).toEqual(false);
      expect(result.updatePaymentTypeError).toEqual(payload.error);
      expect(result.paymentType).toEqual(null);
      expect(
        statesEqual(result, state, [
          'updatePaymentTypeLoading',
          'updatePaymentTypeError',
          'paymentType',
        ]),
      ).toBeTruthy();
    });
  });

  describe('updatePaymentTypeSuccess', () => {
    test('sets updatePaymentTypeLoading and does not modify other state properties', () => {
      const action = fromCartActions.updatePaymentTypeSuccess();
      const result = cartReducer(state, action);

      expect(result.updatePaymentTypeLoading).toEqual(false);
      expect(
        statesEqual(result, state, ['updatePaymentTypeLoading']),
      ).toBeTruthy();
    });
  });

  describe('updateShopCode', () => {
    test('sets updateShopCodeLoading, updateShopCodeError sets delivery type does not modify other state properties', () => {
      const payload: UpdateShopCodePayload = {
        shop: { shopCode: '123' } as Shop,
      };
      const action = fromCartActions.updateShopCode({ payload });
      const result = cartReducer({ ...state, shop: payload.shop }, action);

      expect(result.updateShopCodeLoading).toEqual(true);
      expect(result.updateShopCodeError).toEqual(null);
      expect(result.shop).toEqual(payload.shop);
      expect(
        statesEqual(result, state, [
          'updateShopCodeLoading',
          'updateShopCodeError',
          'shop',
        ]),
      ).toBeTruthy();
    });
  });

  describe('updateShopCodeFail', () => {
    test('sets updateShopCodeLoading, updateShopCodeError, unset the delivery type and does not modify other state properties', () => {
      const payload = {
        error: {} as ApiError,
      };

      const action = fromCartActions.updateShopCodeFail({ payload });
      const result = cartReducer(state, action);

      expect(result.updateShopCodeLoading).toEqual(false);
      expect(result.updateShopCodeError).toEqual(payload.error);
      expect(result.shop).toEqual(null);
      expect(
        statesEqual(result, state, [
          'updateShopCodeLoading',
          'updateShopCodeError',
          'shop',
        ]),
      ).toBeTruthy();
    });
  });

  describe('updateShopCodeSuccess', () => {
    test('sets updateShopCodeLoading and does not modify other state properties', () => {
      const action = fromCartActions.updateShopCodeSuccess();
      const result = cartReducer(state, action);

      expect(result.updateShopCodeLoading).toEqual(false);
      expect(
        statesEqual(result, state, ['updateShopCodeLoading']),
      ).toBeTruthy();
    });
  });

  describe('getDeliveryTimeCollection', () => {
    test('sets deliveryTimeCollection, deliveryTimeCollectionLoading, deliveryTimeCollectionLoadError and does not modify other state properties', () => {
      const action = fromCartActions.getDeliveryTimeCollection();
      const result = cartReducer(state, action);

      expect(result.deliveryTimeCollection).toEqual([]);
      expect(result.deliveryTimeCollectionLoading).toEqual(true);
      expect(result.deliveryTimeCollectionLoadError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'deliveryTimeCollection',
          'deliveryTimeCollectionLoading',
          'deliveryTimeCollectionLoadError',
        ]),
      ).toBeTruthy();
    });
  });

  describe('getDeliveryTimeCollectionFail', () => {
    test('sets deliveryTimeCollection, deliveryTimeCollectionLoading, deliveryTimeCollectionLoadError and does not modify other state properties', () => {
      const payload = {
        error: '',
      } as any;
      const action = fromCartActions.getDeliveryTimeCollectionFail({ payload });
      const result = cartReducer(state, action);

      expect(result.deliveryTimeCollection).toEqual([]);
      expect(result.deliveryTimeCollectionLoading).toEqual(false);
      expect(result.deliveryTimeCollectionLoadError).toEqual(payload.error);
      expect(
        statesEqual(result, state, [
          'deliveryTimeCollection',
          'deliveryTimeCollectionLoading',
          'deliveryTimeCollectionLoadError',
        ]),
      ).toBeTruthy();
    });
  });

  describe('getDeliveryTimeCollectionSuccess', () => {
    test('sets deliveryTimeCollection, deliveryTimeCollectionLoading, deliveryTimeCollectionLoadError and does not modify other state properties', () => {
      const items: GetDeliveryTimeCollectionSuccessPayload = {
        data: [
          {
            deliveryDate: new Date(),
            deliveryDatePrice: 1,
            deliveryHoursDetails: [],
            availableServices: [],
          },
        ],
      };
      const action = fromCartActions.getDeliveryTimeCollectionSuccess({
        payload: items,
      });
      const result = cartReducer(state, action);

      expect(result.deliveryTimeCollection).toEqual(items.data);
      expect(result.deliveryTimeCollectionLoading).toEqual(false);
      expect(result.deliveryTimeCollectionLoadError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'deliveryTimeCollection',
          'deliveryTimeCollectionLoading',
          'deliveryTimeCollectionLoadError',
        ]),
      ).toBeTruthy();
    });
  });

  describe('updateDeliveryTime', () => {
    test('sets updateDeliveryTimeLoading, updateDeliveryTimeError sets delivery type does not modify other state properties', () => {
      const payload: UpdateDeliveryTimePayload = {
        deliveryTime: {
          date: new Date(),
          hours: null,
          price: null,
        },
      };
      const action = fromCartActions.updateDeliveryTime({ payload });
      const result = cartReducer(
        { ...state, deliveryTime: payload.deliveryTime },
        action,
      );

      expect(result.deliveryTime).toEqual(payload.deliveryTime);
      expect(result.updateDeliveryTimeLoading).toEqual(true);
      expect(result.updateDeliveryTimeError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'updateDeliveryTimeLoading',
          'updateDeliveryTimeError',
          'deliveryTime',
        ]),
      ).toBeTruthy();
    });
  });

  describe('updateDeliveryTimeFail', () => {
    test('sets updateDeliveryTimeLoading, updateDeliveryTimeError, unset the delivery type and does not modify other state properties', () => {
      const payload = {
        error: {} as ApiError,
        deliveryTime: null,
      };

      const action = fromCartActions.updateDeliveryTimeFail({
        payload,
      });
      const result = cartReducer(state, action);

      expect(result.updateDeliveryTimeLoading).toEqual(false);
      expect(result.updateDeliveryTimeError).toEqual(payload.error);
      expect(result.deliveryTime).toEqual(null);
      expect(
        statesEqual(result, state, [
          'updateDeliveryTimeLoading',
          'updateDeliveryTimeError',
          'deliveryTime',
        ]),
      ).toBeTruthy();
    });
  });

  describe('updateDeliveryTimeSuccess', () => {
    test('sets updateDeliveryTimeLoading and does not modify other state properties', () => {
      const action = fromCartActions.updateDeliveryTimeSuccess();
      const result = cartReducer(state, action);

      expect(result.updateDeliveryTimeLoading).toEqual(false);
      expect(
        statesEqual(result, state, ['updateDeliveryTimeLoading']),
      ).toBeTruthy();
    });
  });

  describe('updateZipCode', () => {
    test('sets updateZipCodeLoading and does not modify other state properties', () => {
      const payload: UpdateZipCodePayload = { zipCode: '00-000' };
      const action = fromCartActions.updateZipCode({ payload });
      const result = cartReducer(state, action);

      expect(result.zipCode).toEqual(null);
      expect(result.updateZipCodeLoading).toEqual(true);
      expect(statesEqual(result, state, ['updateZipCodeLoading'])).toBeTruthy();
    });
  });

  describe('updateZipCodeFail', () => {
    test('sets zipCode, updateZipCodeError, updateZipCodeLoading and does not modify other state properties', () => {
      const payload: UpdateZipCodeFailPayload = {
        error: {
          messages: [],
          status: 400,
          possibleCity: [],
          error: '',
        },
      };

      const action = fromCartActions.updateZipCodeFail({
        payload,
      });
      const result = cartReducer(state, action);

      expect(result.zipCode).toEqual(null);
      expect(result.updateZipCodeError).toEqual(payload.error);
      expect(result.updateZipCodeLoading).toEqual(false);
      expect(result.zipCodeSuggestion).toEqual(null);

      expect(
        statesEqual(result, state, [
          'zipCode',
          'updateZipCodeLoading',
          'updateZipCodeError',
          'zipCodeSuggestion',
          'zipCodePossibleCityCollection',
        ]),
      ).toBeTruthy();
    });
  });

  describe('updateZipCodeSuccess', () => {
    test('sets updateZipCodeError, updateZipCodeLoading, zipCodeSuggestion and does not modify other state properties', () => {
      const payload: UpdateZipCodePayload = { zipCode: '00-000' };
      const action = fromCartActions.updateZipCodeSuccess({ payload });
      const result = cartReducer(state, action);

      expect(result.zipCode).toEqual(payload.zipCode);
      expect(result.updateZipCodeError).toEqual(null);
      expect(result.updateZipCodeLoading).toEqual(false);
      expect(result.zipCodeSuggestion).toEqual(null);

      expect(
        statesEqual(result, state, [
          'zipCode',
          'updateZipCodeLoading',
          'updateZipCodeError',
          'zipCodeSuggestion',
          'zipCodePossibleCityCollection',
        ]),
      ).toBeTruthy();
    });
  });

  describe('getZipCodeFromCoordinates', () => {
    test('sets updateZipCodeLoading, locationError and does not modify other state properties', () => {
      const action = fromCartActions.getZipCodeFromCoordinates();
      const result = cartReducer(state, action);

      expect(result.updateZipCodeLoading).toEqual(true);
      expect(result.locationError).toEqual(null);
      expect(
        statesEqual(result, state, ['updateZipCodeLoading', 'locationError']),
      ).toBeTruthy();
    });
  });

  describe('getZipCodeFromCoordinatesFail', () => {
    test('sets locationError, zipCodeSuggestion, updateZipCodeLoading and does not modify other state properties', () => {
      const payload: GetZipCodeFromCoordinatesFailPayload = {
        error: LocationError.TIMEOUT,
      };
      const action = fromCartActions.getZipCodeFromCoordinatesFail({ payload });
      const result = cartReducer(state, action);

      expect(result.updateZipCodeLoading).toEqual(false);
      expect(result.zipCodeSuggestion).toEqual(null);
      expect(result.locationError).toEqual(payload.error);

      expect(
        statesEqual(result, state, [
          'updateZipCodeLoading',
          'zipCodeSuggestion',
          'locationError',
        ]),
      ).toBeTruthy();
    });
  });

  describe('getZipCodeFromCoordinatesSuccess', () => {
    test('sets updateZipCodeLoading, zipCodeSuggestion and does not modify other state properties', () => {
      const payload: GetZipCodeFromCoordinatesSuccessPayload = {
        zipCode: '00-000',
        city: 'lorem',
      };
      const action = fromCartActions.getZipCodeFromCoordinatesSuccess({
        payload,
      });
      const result = cartReducer(state, action);

      expect(result.updateZipCodeLoading).toEqual(false);
      expect(result.zipCodeSuggestion).toEqual(payload);

      expect(
        statesEqual(result, state, [
          'updateZipCodeLoading',
          'zipCodeSuggestion',
        ]),
      ).toBeTruthy();
    });
  });

  describe('clearZipCodeErrorsAndSuggestion', () => {
    test('sets updateZipCodeError, zipCodeSuggestion and does not modify other state properties', () => {
      const action = fromCartActions.clearZipCodeErrorsAndSuggestion();
      const result = cartReducer(state, action);

      expect(result.updateZipCodeError).toEqual(null);
      expect(result.zipCodeSuggestion).toEqual(null);
      expect(result.locationError).toEqual(null);

      expect(
        statesEqual(result, state, [
          'updateZipCodeError',
          'zipCodeSuggestion',
          'locationError',
          'zipCodePossibleCityCollection',
        ]),
      ).toBeTruthy();
    });
  });

  describe('clearZipCode', () => {
    test('sets updateZipCodeLoading, updateZipCodeError, zipCode, zipCodeSuggestion, zipCodePossibleCityCollection and does not modify other state properties', () => {
      const action = fromCartActions.clearZipCode();
      const result = cartReducer(state, action);

      expect(result.updateZipCodeLoading).toEqual(false);
      expect(result.updateZipCodeError).toEqual(null);
      expect(result.zipCode).toEqual(null);
      expect(result.zipCodeSuggestion).toEqual(null);
      expect(result.zipCodePossibleCityCollection).toEqual([]);

      expect(
        statesEqual(result, state, [
          'updateZipCodeLoading',
          'updateZipCodeError',
          'zipCode',
          'zipCodeSuggestion',
          'zipCodePossibleCityCollection',
        ]),
      ).toBeTruthy();
    });
  });

  describe('clearZipCode', () => {
    test('sets updateZipCodeError, zipCodeSuggestion, updateZipCodeLoading, zipCode and does not modify other state properties', () => {
      const action = fromCartActions.clearZipCodeErrorsAndSuggestion();
      const result = cartReducer(state, action);

      expect(result.updateZipCodeLoading).toEqual(false);
      expect(result.zipCode).toEqual(null);
      expect(result.updateZipCodeError).toEqual(null);
      expect(result.zipCodeSuggestion).toEqual(null);

      expect(
        statesEqual(result, state, [
          'updateZipCodeError',
          'zipCodeSuggestion',
          'zipCode',
          'updateZipCodeLoading',
          'zipCodePossibleCityCollection',
        ]),
      ).toBeTruthy();
    });
  });

  describe('getServicesSuccess', () => {
    test('sets services and does not modify other state properties', () => {
      const payload: GetServicesSuccessPayload[] = [
        {
          descriptionStyleFile: '',
          serviceGroups: [],
          partnerSubscriptionGroups: [],
        },
      ];
      const action = fromCartActions.getServicesSuccess({ payload });
      const result = cartReducer(state, action);

      expect(result.services).toEqual(payload);

      expect(statesEqual(result, state, ['services'])).toBeTruthy();
    });
  });

  describe('getRecommendedInsurances', () => {
    test('sets recommendedInsurances and does not modify other state properties', () => {
      const payload: GetInsurancesRecommendedRequestParams = {
        productPlu: '',
      };

      const action = fromCartActions.getRecommendedInsurances({ payload });
      const result = cartReducer(state, action);

      expect(result.recommendedInsurances).toEqual(null);

      expect(
        statesEqual(result, state, ['recommendedInsurances']),
      ).toBeTruthy();
    });
  });

  describe('getRecommendedInsurancesSuccess', () => {
    test('sets recommendedInsurances and does not modify other state properties', () => {
      const payload: GetRecommendedInsurancesSuccessPayload = {
        insuranceForProductGrupDescription: '',
        paymentTypesDisplayOrder: [],
        recommendedInsurancesForPaymentType: [],
      };

      const action = fromCartActions.getRecommendedInsurancesSuccess({
        payload,
      });
      const result = cartReducer(state, action);

      expect(result.recommendedInsurances).toEqual(payload);

      expect(
        statesEqual(result, state, ['recommendedInsurances']),
      ).toBeTruthy();
    });
  });

  describe('redirectToCart', () => {
    test('sets insurancesForPopUp, insurancesForPopUpLoaded, redirectToCartPayload and does not modify other state properties', () => {
      const payload = {} as any;
      const action = fromCartActions.redirectToCart({ payload });
      const result = cartReducer(state, action);

      expect(
        statesEqual(result, state, [
          'insurancesForPopUp',
          'insurancesForPopUpLoaded',
          'redirectToCartPayload',
        ]),
      ).toBeTruthy();
    });
  });
});
