import { cartInitialState, CartState, CART_FEATURE_KEY } from './cart.reducer';
import { cartQuery } from './cart.selectors';
import {
  CartDynamicSetAccessory,
  CartItem,
} from '@ems/euro-mobile/cart/domain';

describe('Cart Selectors', () => {
  let storeState: { [CART_FEATURE_KEY]: CartState };

  beforeEach(() => {
    storeState = {
      [CART_FEATURE_KEY]: {
        ...cartInitialState,
        cartItemCollection: {
          ids: ['1187026'],
          entities: {
            '1187026': {
              name: 'Whirlpool W7 921O K AQUA',
              identifiers: {
                plu: '1187026',
                productGroupLinkName: undefined,
                productLinkName: undefined,
                huCode: undefined,
              },
              photoPath: 'string',
              iconPhotoPath: 'string',
              price: 1899,
              quantity: 1,
            },
          },
        },
      },
    };
  });

  test('getCartItemCollection() returns cart value', () => {
    const result = cartQuery.getCartItemCollection(storeState);

    expect(result).toEqual([
      {
        name: 'Whirlpool W7 921O K AQUA',
        identifiers: {
          plu: '1187026',
          productGroupLinkName: undefined,
          productLinkName: undefined,
          huCode: undefined,
        },
        photoPath: 'string',
        iconPhotoPath: 'string',
        price: 1899,
        quantity: 1,
      },
    ]);
  });

  test('getDeliveryType() returns cart value', () => {
    const result = cartQuery.getDeliveryType(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].deliveryType);
  });

  test('getPaymentType() returns cart value', () => {
    const result = cartQuery.getPaymentType(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].paymentType);
  });

  test('getDeliveryPrice() returns cart value', () => {
    const result = cartQuery.getDeliveryPrice(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].deliveryPrice);
  });

  test('getPaymentPrice() returns cart value', () => {
    const result = cartQuery.getPaymentPrice(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].paymentPrice);
  });

  test('getCartLoading() returns cartLoading value', () => {
    const result = cartQuery.getCartLoading(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].cartLoading);
  });

  test('getCartLoadError() returns cartLoadError value', () => {
    const result = cartQuery.getCartLoadError(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].cartLoadError);
  });

  test('getAddCartItemLoading() returns addCartItemLoading value', () => {
    const result = cartQuery.getAddCartItemLoading(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].addCartItemLoading);
  });

  test('getAddCartItemError() returns addCartItemError value', () => {
    const result = cartQuery.getAddCartItemError(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].addCartItemError);
  });

  test('getRemoveCartItemLoading() returns removeCartItemLoading value', () => {
    const result = cartQuery.getRemoveCartItemLoading(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].removeCartItemLoading);
  });

  test('getRemoveCartItemError() returns removeCartItemError value', () => {
    const result = cartQuery.getRemoveCartItemError(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].removeCartItemError);
  });

  test('getUpdatePaymentTypeLoading() returns updatePaymentTypeLoading value', () => {
    const result = cartQuery.getUpdatePaymentTypeLoading(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].updatePaymentTypeLoading);
  });

  test('getUpdatePaymentTypeError() returns updatePaymentTypeError value', () => {
    const result = cartQuery.getUpdatePaymentTypeError(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].updatePaymentTypeError);
  });

  test('getUpdateDeliveryTypeLoading() returns updateDeliveryTypeLoading value', () => {
    const result = cartQuery.getUpdateDeliveryTypeLoading(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].updateDeliveryTypeLoading);
  });

  test('getUpdateDeliveryTypeError() returns updateDeliveryTypeError value', () => {
    const result = cartQuery.getUpdateDeliveryTypeError(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].updateDeliveryTypeError);
  });

  test('getShop() returns shop value', () => {
    const result = cartQuery.getShop(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].shop);
  });

  test('getUpdateShopCodeLoading() returns updateShopCodeLoading value', () => {
    const result = cartQuery.getUpdateShopCodeLoading(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].updateShopCodeLoading);
  });

  test('getUpdateShopCodeError() returns updateShopCodeError value', () => {
    const result = cartQuery.getUpdateShopCodeError(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].updateShopCodeError);
  });

  test('getDeliveryTimeCollection() returns deliveryTimeCollection value', () => {
    const result = cartQuery.getDeliveryTimeCollection(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].deliveryTimeCollection);
  });

  test('getDeliveryTimeCollectionLoading() returns deliveryTimeCollectionLoading value', () => {
    const result = cartQuery.getDeliveryTimeCollectionLoading(storeState);

    expect(result).toBe(
      storeState[CART_FEATURE_KEY].deliveryTimeCollectionLoading,
    );
  });

  test('getDeliveryTimeCollectionError() returns deliveryTimeCollectionError value', () => {
    const result = cartQuery.getDeliveryTimeCollectionError(storeState);

    expect(result).toBe(
      storeState[CART_FEATURE_KEY].deliveryTimeCollectionLoadError,
    );
  });

  test('getDeliveryTime() returns deliveryTime value', () => {
    const result = cartQuery.getDeliveryTime(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].deliveryTime);
  });

  test('getUpdateDeliveryTimeLoading() returns updateDeliveryTimeLoading value', () => {
    const result = cartQuery.getUpdateDeliveryTimeLoading(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].updateDeliveryTimeLoading);
  });

  test('getUpdateDeliveryTimeError() returns updateDeliveryTimeError value', () => {
    const result = cartQuery.getUpdateDeliveryTimeError(storeState);

    expect(result).toBe(storeState[CART_FEATURE_KEY].updateDeliveryTimeError);
  });

  test('getZipCode() returns zipCode', () => {
    storeState[CART_FEATURE_KEY].zipCode = '00-000';

    const result = cartQuery.getZipCode(storeState);
    expect(result).toEqual(storeState[CART_FEATURE_KEY].zipCode);
  });

  test('getUpdateZipCodeLoading() returns updateZipCodeLoading', () => {
    storeState[CART_FEATURE_KEY].updateZipCodeLoading = true;

    const result = cartQuery.getUpdateZipCodeLoading(storeState);
    expect(result).toEqual(storeState[CART_FEATURE_KEY].updateZipCodeLoading);
  });

  test('getUpdateZipCodeError() returns updateZipCodeError', () => {
    storeState[CART_FEATURE_KEY].updateZipCodeError = {
      messages: [],
      status: 400,
    };

    const result = cartQuery.getUpdateZipCodeError(storeState);
    expect(result).toEqual(storeState[CART_FEATURE_KEY].updateZipCodeError);
  });

  test('getZipCodeSuggestion() returns zipCodeSuggestion', () => {
    storeState[CART_FEATURE_KEY].zipCodeSuggestion = {
      zipCode: '00-000',
      city: 'lorem',
    };

    const result = cartQuery.getZipCodeSuggestion(storeState);
    expect(result).toEqual(storeState[CART_FEATURE_KEY].zipCodeSuggestion);
  });

  test('getZipCodePossibleCityCollection() returns zipCodePossibleCityCollection', () => {
    storeState[CART_FEATURE_KEY].zipCodePossibleCityCollection = [
      'a',
      'b',
      'c',
    ];

    const result = cartQuery.getZipCodePossibleCityCollection(storeState);
    expect(result).toEqual(
      storeState[CART_FEATURE_KEY].zipCodePossibleCityCollection,
    );
  });

  test('getServices() returns services', () => {
    storeState[CART_FEATURE_KEY].services = [
      {
        descriptionStyleFile: '',
        serviceGroups: [],
        partnerSubscriptionGroups: [],
      },
    ];

    const result = cartQuery.getServices(storeState);
    expect(result).toEqual(storeState[CART_FEATURE_KEY].services);
  });

  test('getRecommendedInsurances() returns recommendedInsurances', () => {
    storeState[CART_FEATURE_KEY].recommendedInsurances = {
      insuranceForProductGrupDescription: '',
      paymentTypesDisplayOrder: [],
      recommendedInsurancesForPaymentType: [],
    };

    const result = cartQuery.getRecommendedInsurances(storeState);
    expect(result).toEqual(storeState[CART_FEATURE_KEY].recommendedInsurances);
  });

  describe('getCartValue()', () => {
    const productPlu = '1187026';
    const packageIdentifier = '1234';
    const productsEntities = {
      [productPlu]: {
        identifiers: {
          plu: productPlu,
          productLinkName: undefined,
          productGroupLinkName: undefined,
          huCode: undefined,
        },
        price: 1899,
        image: [],
        name: 'Whirlpool W7 921O K AQUA',
        productGroup: 'Lodówki',
        productName: 'Lodówka',
        quantity: 1,
        services: [
          {
            plu: '1',
            name: '',
            price: 0,
            quantity: 1,
          },
          {
            plu: '2',
            name: '',
            price: 11,
            quantity: 1,
          },
        ],
      } as CartItem,
    };
    const cartDynamicSetAccessoriesEntities = {
      [packageIdentifier]: {
        identifier: packageIdentifier,
        name: 'Whirlpool W7 921O K AQUA',
        quantity: 1,
        price: 123,
        elements: [
          {
            name: 'Rura',
            price: 100,
            quantity: 1,
          },
          {
            name: 'Bęben',
            price: 23,
            quantity: 1,
          },
        ],
      } as CartDynamicSetAccessory,
    };
    test('returns cart value from product price', () => {
      const result = cartQuery.getCartValue(storeState);

      const expectedProductPrice = 1899;
      expect(result).toEqual(expectedProductPrice);
    });
    test('returns cart value from product price and services', () => {
      const result = cartQuery.getCartValue({
        [CART_FEATURE_KEY]: {
          ...cartInitialState,
          cartItemCollection: {
            ids: ['1187026'],
            entities: productsEntities,
          },
        },
      });

      const expectedProductPrice = 1899;
      const expectedServicesPrice = 11;
      expect(result).toEqual(expectedProductPrice + expectedServicesPrice);
    });
    test('returns cart value from products prices and services', () => {
      const result = cartQuery.getCartValue({
        [CART_FEATURE_KEY]: {
          ...cartInitialState,
          cartItemCollection: {
            ids: ['1187026'],
            entities: {
              [productPlu]: {
                ...productsEntities[productPlu],
                quantity: 2,
              },
            },
          },
        },
      });

      const expectedProductPrice = 1899;
      const expectedServicesPriceForFirstProduct = 11;
      expect(result).toEqual(
        expectedProductPrice * 2 + expectedServicesPriceForFirstProduct,
      );
    });
    test('returns cart value from products prices and services and dynamic set', () => {
      const result = cartQuery.getCartValue({
        [CART_FEATURE_KEY]: {
          ...cartInitialState,
          cartItemCollection: {
            ids: [productPlu],
            entities: {
              [productPlu]: {
                ...productsEntities[productPlu],
                quantity: 2,
              },
            },
          },
          cartDynamicSetAccessoryCollection: {
            ids: [packageIdentifier],
            entities: cartDynamicSetAccessoriesEntities,
          },
        },
      });

      const expectedProductPrice = 1899;
      const expectedServicesPriceForFirstProduct = 11;
      const expectedDynamicSetPrice = 123;
      expect(result).toEqual(
        expectedProductPrice * 2 +
          expectedServicesPriceForFirstProduct +
          expectedDynamicSetPrice,
      );
    });
  });

  describe('getCartItemsQuantity()', () => {
    const productPlu = '1187026';
    const packageIdentifier = '1234';
    const productsEntities = {
      [productPlu]: {
        identifiers: {
          plu: productPlu,
          productLinkName: undefined,
          productGroupLinkName: undefined,
          huCode: undefined,
        },
        price: 1899,
        image: [],
        name: 'Whirlpool W7 921O K AQUA',
        productGroup: 'Lodówki',
        productName: 'Lodówka',
        quantity: 1,
        services: [
          {
            plu: '1',
            name: '',
            price: 0,
            quantity: 1,
          },
          {
            plu: '2',
            name: '',
            price: 11,
            quantity: 2,
          },
        ],
      } as CartItem,
    };
    const cartDynamicSetAccessoriesEntities = {
      [packageIdentifier]: {
        identifier: packageIdentifier,
        name: 'Whirlpool W7 921O K AQUA',
        quantity: 1,
        price: 123,
        elements: [
          {
            name: 'Rura',
            price: 100,
            quantity: 1,
          },
          {
            name: 'Bęben',
            price: 23,
            quantity: 2,
          },
        ],
      } as CartDynamicSetAccessory,
    };
    test('returns cart items quantity from product', () => {
      const result = cartQuery.getCartItemsQuantity(storeState);

      const expectedCartItemsQuantity = 1;
      expect(result).toEqual(expectedCartItemsQuantity);
    });
    test('returns cart items quantity from products and services', () => {
      const result = cartQuery.getCartItemsQuantity({
        [CART_FEATURE_KEY]: {
          ...cartInitialState,
          cartItemCollection: {
            ids: ['1187026'],
            entities: productsEntities,
          },
        },
      });

      const expectedCartItemsQuantity = 1;
      expect(result).toEqual(expectedCartItemsQuantity);
    });
    test('returns cart items quantity from products and services', () => {
      const result = cartQuery.getCartItemsQuantity({
        [CART_FEATURE_KEY]: {
          ...cartInitialState,
          cartItemCollection: {
            ids: ['1187026'],
            entities: {
              [productPlu]: {
                ...productsEntities[productPlu],
                quantity: 2,
              },
            },
          },
        },
      });

      const expectedCartItemsQuantity = 2;
      expect(result).toEqual(expectedCartItemsQuantity);
    });
    test('returns cart value from products prices and services and dynamic set', () => {
      const result = cartQuery.getCartItemsQuantity({
        [CART_FEATURE_KEY]: {
          ...cartInitialState,
          cartItemCollection: {
            ids: [productPlu],
            entities: {
              [productPlu]: {
                ...productsEntities[productPlu],
                quantity: 2,
              },
            },
          },
          cartDynamicSetAccessoryCollection: {
            ids: [packageIdentifier],
            entities: cartDynamicSetAccessoriesEntities,
          },
        },
      });

      const expectedCartItemsQuantity = 2;
      const expectedDynamicSetItemsQuantity = 1;
      const expectedDynamicSetAccessoryQuantity = 3;
      expect(result).toEqual(
        expectedCartItemsQuantity +
          expectedDynamicSetItemsQuantity +
          expectedDynamicSetAccessoryQuantity,
      );
    });
  });
});
