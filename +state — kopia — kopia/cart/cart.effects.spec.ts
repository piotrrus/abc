import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AddCartItemPayload,
  AddCartItemSuccessPayload,
  GetDeliveryTimeCollectionSuccessPayload,
  GetProductInsurancesEncouragementsForCartPayload,
  GetServicesPayload,
  GetZipCodeFromCoordinatesFailPayload,
  UpdateDeliveryTimePayload,
  UpdatePaymentTypePayload,
  UpdateShopCodePayload,
  UpdateZipCodePayload,
} from '@ems/euro-mobile/cart/domain';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  CartDataService,
  HomeDeliveryDataService,
  InsurancesDataService,
  ServicesDataService,
} from '@ems/euro-mobile/cart/infrastructure';
import { PaymentTypeEnum, Shop } from '@ems/euro-mobile/dictionary/domain';
import { EnabledAuthContext } from '@ems/euro-mobile/shared/domain';
import { ApiError, LocationError } from '@ems/shared/domain';
import { InsurancesApiService } from '@ems/shared/domain-openapi-contracts/insurances';
import { FeatureTogglesService } from '@ems/shared/util-feature-toggles';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { createSpyObj } from 'jest-createspyobj';
import { cold, hot } from 'jest-marbles';
import { MockProviders } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { CartIdFacade } from '../cart-id/cart-id-facade';
import { fromCartActions } from './cart.actions';
import { CartEffects } from './cart.effects';
import { CART_FEATURE_KEY } from './cart.reducer';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  AddCartItemWithAdditionalInfoHandler,
  AddToCartItemErrorHandlerService,
} from '../../../../../feature-error-handler/src';

describe('CartEffects', () => {
  let cartDataService: jest.Mocked<CartDataService>;
  let servicesDataService: jest.Mocked<ServicesDataService>;
  let insurancesDataService: jest.Mocked<InsurancesDataService>;
  let insurancesApiService: jest.Mocked<InsurancesApiService>;

  let homeDeliveryDataService: jest.Mocked<HomeDeliveryDataService>;
  let actions: Observable<unknown>;
  let effects: CartEffects;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'cart/thank-you.bhtml',
            component: class {},
          },
        ]),
      ],
      providers: [
        CartEffects,
        provideMockActions(() => actions),
        provideMockStore({ initialState: {} }),
        MockProviders(FeatureTogglesService),
        {
          provide: CartDataService,
          useValue: createSpyObj(CartDataService),
        },
        {
          provide: CartIdFacade,
          useValue: createSpyObj(CartIdFacade),
        },
        {
          provide: HomeDeliveryDataService,
          useValue: createSpyObj(HomeDeliveryDataService),
        },
        {
          provide: ServicesDataService,
          useValue: createSpyObj(ServicesDataService),
        },
        {
          provide: InsurancesDataService,
          useValue: createSpyObj(InsurancesDataService),
        },
        {
          provide: InsurancesApiService,
          useValue: createSpyObj(InsurancesApiService),
        },
        {
          provide: Store,
          useValue: of({
            [CART_FEATURE_KEY]: {
              cartItemCollection: {
                ids: ['1187026'],
                entities: {
                  '1187026': {
                    plu: '1187026',
                    price: 1899,
                    image: [],
                    name: 'Whirlpool W7 921O K AQUA',
                    productGroup: 'Lodówki',
                    quantity: 1,
                  },
                },
              },
            },
          }),
        },
        {
          provide: AddToCartItemErrorHandlerService,
          useValue: createSpyObj(AddToCartItemErrorHandlerService),
        },
        {
          provide: AddCartItemWithAdditionalInfoHandler,
          useValue: createSpyObj(AddCartItemWithAdditionalInfoHandler),
        },
        {
          provide: DOCUMENT,
          useValue: {
            location: () => {
              return;
            },
            querySelectorAll: () => [],
          },
        },
      ],
    });

    effects = TestBed.inject(CartEffects);
    cartDataService = TestBed.inject(
      CartDataService,
    ) as jest.Mocked<CartDataService>;
    servicesDataService = TestBed.inject(
      ServicesDataService,
    ) as jest.Mocked<ServicesDataService>;
    homeDeliveryDataService = TestBed.inject(
      HomeDeliveryDataService,
    ) as jest.Mocked<HomeDeliveryDataService>;
    insurancesDataService = TestBed.inject(
      InsurancesDataService,
    ) as jest.Mocked<InsurancesDataService>;
    insurancesApiService = TestBed.inject(
      InsurancesApiService,
    ) as jest.Mocked<InsurancesApiService>;
    doc = TestBed.inject(DOCUMENT);
  });

  describe('addCartItem$', () => {
    const payload: AddCartItemPayload = {
      identifiers: {
        plu: '1187026',
        productGroupLinkName: undefined,
        productLinkName: 'testlink',
      },
      price: 12,
      image: [],
      name: 'cartItem',
      productGroup: 'test',
      productName: 'pralka',
      services: [],
      productNumber: '1',
      instalmentOptionCode: 'code',
      instalmentNumber: 20,
    };

    test('returns addCartItemSuccess action on success', () => {
      const action = fromCartActions.addCartItem({ payload });
      const completion = fromCartActions.addCartItemSuccess({
        payload: {
          productPlu: '1187026',
          accessoriesToCartAvailable: undefined,
          insuranceEncouragementAvailable: undefined,
          messageForUser: undefined,
          productLinkName: 'testlink',
          noRedirect: undefined,
        },
      });
      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: {} });
      const expected = cold('---c', { c: completion });
      cartDataService.addCartItem.mockReturnValue(response);

      expect(effects.addCartItem$).toSatisfyOnFlush(() => {
        expect(cartDataService.addCartItem).toHaveBeenCalled();
      });
      expect(effects.addCartItem$).toBeObservable(expected);
    });

    test('returns addCartItemSuccess action on success', () => {
      const action = fromCartActions.addCartItem({ payload });
      const completion = fromCartActions.addCartItemSuccess({
        payload: {
          // @todo do we need redirectUrl here
          // redirectUrl: undefined,
          // productNumber: '1',
          // productPlu: '1187026',
          // services: [],
          productPlu: '1187026',
          accessoriesToCartAvailable: undefined,
          insuranceEncouragementAvailable: undefined,
          messageForUser: undefined,
          productLinkName: 'testlink',
          noRedirect: undefined,
        },
      });
      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: {} });
      const expected = cold('---c', { c: completion });
      cartDataService.addCartItem.mockReturnValue(response);

      expect(effects.addCartItem$).toSatisfyOnFlush(() => {
        expect(cartDataService.addCartItem).toHaveBeenCalled();
      });
      expect(effects.addCartItem$).toBeObservable(expected);
    });

    test('returns addCartItemFail action on fail', () => {
      const action = fromCartActions.addCartItem({ payload });
      const completion = fromCartActions.addCartItemFail({
        payload: {
          error: {} as ApiError,
          plu: '1187026',
          productName: 'cartItem',
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });
      cartDataService.addCartItem.mockReturnValue(response);

      expect(effects.addCartItem$).toSatisfyOnFlush(() => {
        expect(cartDataService.addCartItem).toHaveBeenCalled();
      });
      expect(effects.addCartItem$).toBeObservable(expected);
    });
  });

  describe('updatePaymentType$', () => {
    const payload: UpdatePaymentTypePayload = {
      paymentType: PaymentTypeEnum.SHOP,
      paymentPrice: 0,
    };

    test('returns updatePaymentTypeSuccess on success', () => {
      const action = fromCartActions.updatePaymentType({ payload });
      const completion = fromCartActions.updatePaymentTypeSuccess();

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: {} });
      const expected = cold('---c', { c: completion });
      cartDataService.updatePaymentType.mockReturnValue(response);

      expect(effects.updatePaymentType$).toSatisfyOnFlush(() => {
        expect(cartDataService.updatePaymentType).toHaveBeenCalled();
      });
      expect(effects.updatePaymentType$).toBeObservable(expected);
    });

    test('returns updatePaymentTypeFail action on fail', () => {
      const action = fromCartActions.updatePaymentType({ payload });
      const completion = fromCartActions.updatePaymentTypeFail({
        payload: {
          error: {} as ApiError,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });
      cartDataService.updatePaymentType.mockReturnValue(response);

      expect(effects.updatePaymentType$).toSatisfyOnFlush(() => {
        expect(cartDataService.updatePaymentType).toHaveBeenCalled();
      });
      expect(effects.updatePaymentType$).toBeObservable(expected);
    });
  });
  describe('updateShopCode$', () => {
    const payload: UpdateShopCodePayload = {
      shop: {
        shopCode: '123',
      } as Shop,
    };

    test('returns updateShopCodeSuccess on success', () => {
      const action = fromCartActions.updateShopCode({ payload });
      const completion = fromCartActions.updateShopCodeSuccess();

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: {} });
      const expected = cold('---c', { c: completion });
      cartDataService.updateShopCode.mockReturnValue(response);

      expect(effects.updateShopCode$).toSatisfyOnFlush(() => {
        expect(cartDataService.updateShopCode).toHaveBeenCalled();
      });
      expect(effects.updateShopCode$).toBeObservable(expected);
    });

    test('returns updateShopCodeFail action on fail', () => {
      const action = fromCartActions.updateShopCode({ payload });
      const completion = fromCartActions.updateShopCodeFail({
        payload: {
          error: {} as ApiError,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });
      cartDataService.updateShopCode.mockReturnValue(response);

      expect(effects.updateShopCode$).toSatisfyOnFlush(() => {
        expect(cartDataService.updateShopCode).toHaveBeenCalled();
      });
      expect(effects.updateShopCode$).toBeObservable(expected);
    });
  });

  describe('getDeliveryTimeCollection$', () => {
    const payload: GetDeliveryTimeCollectionSuccessPayload = { data: [] };

    test('returns getDeliveryTimeCollectionSuccess on success', () => {
      const action = fromCartActions.getDeliveryTimeCollection();
      const completion = fromCartActions.getDeliveryTimeCollectionSuccess({
        payload,
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload.data });
      const expected = cold('---c', { c: completion });
      cartDataService.getDeliveryTimeCollection.mockReturnValue(response);

      expect(effects.getDeliveryTimeCollection$).toSatisfyOnFlush(() => {
        expect(cartDataService.getDeliveryTimeCollection).toHaveBeenCalled();
      });
      expect(effects.getDeliveryTimeCollection$).toBeObservable(expected);
    });

    test('returns getDeliveryTimeCollectionFail action on fail', () => {
      const action = fromCartActions.getDeliveryTimeCollection();
      const completion = fromCartActions.getDeliveryTimeCollectionFail({
        payload: {
          error: {} as ApiError,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });
      cartDataService.getDeliveryTimeCollection.mockReturnValue(response);

      expect(effects.getDeliveryTimeCollection$).toSatisfyOnFlush(() => {
        expect(cartDataService.getDeliveryTimeCollection).toHaveBeenCalled();
      });
      expect(effects.getDeliveryTimeCollection$).toBeObservable(expected);
    });
  });

  describe('updateDeliveryTime$', () => {
    const payload: UpdateDeliveryTimePayload = {
      deliveryTime: {
        date: new Date(),
        hours: null,
        price: null,
      },
    };

    test('returns updateDeliveryTimeSuccess on success', () => {
      const action = fromCartActions.updateDeliveryTime({ payload });
      const completion = fromCartActions.updateDeliveryTimeSuccess();

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: completion });
      cartDataService.updateDeliveryTime.mockReturnValue(response);

      expect(effects.updateDeliveryTime$).toSatisfyOnFlush(() => {
        expect(cartDataService.updateDeliveryTime).toHaveBeenCalled();
      });
      expect(effects.updateDeliveryTime$).toBeObservable(expected);
    });
    test('returns updateDeliveryTimeFail action on fail', () => {
      const action = fromCartActions.updateDeliveryTime({ payload });
      const completion = fromCartActions.updateDeliveryTimeFail({
        payload: {
          error: {} as ApiError,
          deliveryTime: null,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });
      cartDataService.updateDeliveryTime.mockReturnValue(response);

      expect(effects.updateDeliveryTime$).toSatisfyOnFlush(() => {
        expect(cartDataService.updateDeliveryTime).toHaveBeenCalled();
      });
      expect(effects.updateDeliveryTime$).toBeObservable(expected);
    });
  });

  describe('updateZipCode$', () => {
    const payload: UpdateZipCodePayload = { zipCode: '' };

    test('returns updateZipCodeSuccess on success', () => {
      const action = fromCartActions.updateZipCode({ payload });
      const completion = fromCartActions.updateZipCodeSuccess({ payload });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: completion });
      homeDeliveryDataService.updateZipCode.mockReturnValue(response);

      expect(effects.updateZipCode$).toSatisfyOnFlush(() => {
        expect(homeDeliveryDataService.updateZipCode).toHaveBeenCalled();
      });
      expect(effects.updateZipCode$).toBeObservable(expected);
    });

    test('returns updateZipCodeFail action on fail', () => {
      const action = fromCartActions.updateZipCode({ payload });
      const completion = fromCartActions.updateZipCodeFail({
        payload: {
          error: { messages: [], status: 406, error: '', possibleCity: [] },
        },
      });

      actions = hot('-a', { a: action });
      const response = cold(
        '-#',
        {},
        { messages: [], status: 406, error: '', possibleCity: [] },
      );
      const expected = cold('--c', { c: completion });
      homeDeliveryDataService.updateZipCode.mockReturnValue(response);

      expect(effects.updateZipCode$).toSatisfyOnFlush(() => {
        expect(homeDeliveryDataService.updateZipCode).toHaveBeenCalled();
      });
      expect(effects.updateZipCode$).toBeObservable(expected);
    });

    test('returns updateZipCodeFail with possible cities on fail', () => {
      const action = fromCartActions.updateZipCode({ payload });
      const completion = fromCartActions.updateZipCodeFail({
        payload: {
          error: {
            messages: [],
            status: 406,
            error: 'AMBIGUOUS_CITY',
            possibleCity: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'],
          },
        },
      });

      actions = hot('-a', { a: action });
      const response = cold(
        '-#',
        {},
        {
          messages: [],
          status: 406,
          error: 'AMBIGUOUS_CITY',
          possibleCity: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'],
        },
      );
      const expected = cold('--c', { c: completion });
      homeDeliveryDataService.updateZipCode.mockReturnValue(response);

      expect(effects.updateZipCode$).toSatisfyOnFlush(() => {
        expect(homeDeliveryDataService.updateZipCode).toHaveBeenCalled();
      });
      expect(effects.updateZipCode$).toBeObservable(expected);
    });
  });

  describe('getZipCodeFromCoordinates$', () => {
    test('returns getZipCodeFromCoordinatesSuccess on success', () => {
      const payload: UpdateZipCodePayload = {
        zipCode: '00-000',
        city: 'lorem',
      };
      const action = fromCartActions.getZipCodeFromCoordinates();
      const completion = fromCartActions.getZipCodeFromCoordinatesSuccess({
        payload: {
          zipCode: payload.zipCode,
          city: payload.city,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: completion });
      homeDeliveryDataService.getZipCodeFromCoordinates.mockReturnValue(
        response,
      );

      expect(effects.getZipCodeFromCoordinates$).toSatisfyOnFlush(() => {
        expect(
          homeDeliveryDataService.getZipCodeFromCoordinates,
        ).toHaveBeenCalled();
      });
      expect(effects.getZipCodeFromCoordinates$).toBeObservable(expected);
    });

    test('returns getZipCodeFromCoordinatesFail action on fail', () => {
      const payload: GetZipCodeFromCoordinatesFailPayload = {
        error: LocationError.TIMEOUT,
      };
      const action = fromCartActions.getZipCodeFromCoordinates();
      const completion = fromCartActions.getZipCodeFromCoordinatesFail({
        payload,
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, LocationError.TIMEOUT);
      const expected = cold('--c', { c: completion });
      homeDeliveryDataService.getZipCodeFromCoordinates.mockReturnValue(
        response,
      );

      expect(effects.getZipCodeFromCoordinates$).toSatisfyOnFlush(() => {
        expect(
          homeDeliveryDataService.getZipCodeFromCoordinates,
        ).toHaveBeenCalled();
      });
      expect(effects.getZipCodeFromCoordinates$).toBeObservable(expected);
    });
  });

  describe('getServices', () => {
    const payload: GetServicesPayload = {
      productPlu: ['123'],
    };

    test('returns getServicesSuccess action on success', () => {
      const action = fromCartActions.getServices({ payload });
      const completion = fromCartActions.getServicesSuccess({
        payload: [],
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: completion });
      servicesDataService.getServices.mockReturnValue(response);

      expect(effects.getServices$).toSatisfyOnFlush(() => {
        expect(servicesDataService.getServices).toHaveBeenCalled();
        expect(effects.getServices$).toBeObservable(expected);
      });
    });

    test('returns getServicesFail action on fail', () => {
      const action = fromCartActions.getServices({ payload });
      const completion = fromCartActions.getServicesFail({
        payload: {
          error: {} as ApiError,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });

      servicesDataService.getServices.mockReturnValue(response);

      expect(effects.getServices$).toSatisfyOnFlush(() => {
        expect(servicesDataService.getServices).toHaveBeenCalled();
        expect(effects.getServices$).toBeObservable(expected);
      });
    });
  });

  describe('updateServiceSuccess$', () => {
    const payload = {} as never;

    test('returns getCartItems', () => {
      const completion = fromCartActions.getCartItems();

      actions = hot('-a-b-c', {
        a: fromCartActions.deleteServiceSuccess({ payload }),
        b: fromCartActions.addServiceSuccess({ payload }),
        c: fromCartActions.addCartItemSuccess({ payload }),
      });
      const expected = cold('-c-c-c', { c: completion });

      expect(effects.updateServiceSuccess$).toBeObservable(expected);
    });
  });

  describe('getCartItems$', () => {
    test('should return getCartItemsSuccess on success', () => {
      const action = fromCartActions.getCartItems();
      const completion = fromCartActions.getCartItemsSuccess({
        payload: {
          items: [],
        },
      });
      actions = hot('-a', { a: action });
      const response = cold('--b|', {
        b: {
          items: [],
        },
      });
      const expected = cold('---c', { c: completion });
      cartDataService.getCartItems.mockReturnValue(response);

      expect(effects.getCartItems$).toSatisfyOnFlush(() => {
        expect(cartDataService.getCartItems).toHaveBeenCalled();
      });
      expect(effects.getCartItems$).toBeObservable(expected);
    });

    test('returns getCartItemsFail action on fail', () => {
      const action = fromCartActions.getCartItems();
      const completion = fromCartActions.getCartItemsFail({
        payload: {
          error: {} as ApiError,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });
      cartDataService.getCartItems.mockReturnValue(response);

      expect(effects.getCartItems$).toSatisfyOnFlush(() => {
        expect(cartDataService.getCartItems).toHaveBeenCalled();
      });
      expect(effects.getCartItems$).toBeObservable(expected);
    });
  });

  describe('getInsurancesEncouragements', () => {
    test('returns getInsurancesEncouragementsSuccess on success', () => {
      const action = fromCartActions.getInsurancesEncouragements({
        payload: { productPlu: '' },
      });
      const completion = fromCartActions.getInsurancesEncouragementsSuccess({
        payload: {
          encouragementInsurancesForPaymentTypes: [],
          encouragementTitle: '',
          encouragementPhotos: null,
          insuranceForProductGrupDescription: '',
          paymentTypesDisplayOrder: [],
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', {
        b: {
          encouragementInsurancesForPaymentTypes: [],
          encouragementTitle: '',
          encouragementPhotos: null,
          insuranceForProductGrupDescription: '',
          paymentTypesDisplayOrder: [],
        },
      });
      const expected = cold('---c', { c: completion });

      insurancesDataService.prepareArgumentsForOpenApiMethods.mockReturnValue([
        '',
        undefined,
        undefined,
        { context: EnabledAuthContext },
      ]);
      insurancesApiService.getInsurancesEncouragementDetails.mockReturnValue(
        response,
      );

      expect(effects.getInsurancesEncouragements$).toSatisfyOnFlush(() => {
        expect(
          insurancesApiService.getInsurancesEncouragementDetails,
        ).toHaveBeenCalled();
      });
      expect(effects.getInsurancesEncouragements$).toBeObservable(expected);
    });

    test('returns getInsurancesEncouragementsFail action on fail', () => {
      const action = fromCartActions.getInsurancesEncouragements({
        payload: { productPlu: '' },
      });
      const completion = fromCartActions.getInsurancesEncouragementsFail({
        payload: {
          error: {} as ApiError,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });

      insurancesDataService.prepareArgumentsForOpenApiMethods.mockReturnValue([
        '',
        undefined,
        undefined,
        { context: EnabledAuthContext },
      ]);
      insurancesApiService.getInsurancesEncouragementDetails.mockReturnValue(
        response,
      );

      expect(effects.getInsurancesEncouragements$).toSatisfyOnFlush(() => {
        expect(
          insurancesApiService.getInsurancesEncouragementDetails,
        ).toHaveBeenCalled();
      });
      expect(effects.getInsurancesEncouragements$).toBeObservable(expected);
    });
  });

  describe('getRecommendedInsurances', () => {
    test('returns getRecommendedInsurancesSuccess on success', () => {
      const action = fromCartActions.getRecommendedInsurances({
        payload: { productPlu: '' },
      });
      const completion = fromCartActions.getRecommendedInsurancesSuccess({
        payload: {
          insuranceForProductGrupDescription: '',
          paymentTypesDisplayOrder: [],
          recommendedInsurancesForPaymentType: [],
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', {
        b: {
          insuranceForProductGrupDescription: '',
          paymentTypesDisplayOrder: [],
          recommendedInsurancesForPaymentType: [],
        },
      });
      const expected = cold('---c', { c: completion });
      insurancesDataService.getRecommendedInsurances.mockReturnValue(response);

      expect(effects.getRecommendedInsurances$).toSatisfyOnFlush(() => {
        expect(
          insurancesDataService.getRecommendedInsurances,
        ).toHaveBeenCalled();
      });
      expect(effects.getRecommendedInsurances$).toBeObservable(expected);
    });

    test('returns getRecommendedInsurancesFail action on fail', () => {
      const action = fromCartActions.getRecommendedInsurances({
        payload: { productPlu: '' },
      });
      const completion = fromCartActions.getRecommendedInsurancesFail({
        payload: {
          error: {} as ApiError,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });
      insurancesDataService.getRecommendedInsurances.mockReturnValue(response);

      expect(effects.getRecommendedInsurances$).toSatisfyOnFlush(() => {
        expect(
          insurancesDataService.getRecommendedInsurances,
        ).toHaveBeenCalled();
      });
      expect(effects.getRecommendedInsurances$).toBeObservable(expected);
    });
  });

  describe('getProductInsurancesEncouragementsForCart', () => {
    const payload: GetProductInsurancesEncouragementsForCartPayload = {
      cartId: '',
      productPlu: '',
      redirectToCartPayload: null,
    };

    test('returns getProductInsurancesEncouragementsForCartSuccess action on success', () => {
      const action = fromCartActions.getProductInsurancesEncouragementsForCart({
        payload,
      });
      const completion =
        fromCartActions.getProductInsurancesEncouragementsForCartSuccess({
          payload: {} as any,
        });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: completion });

      insurancesDataService.prepareArgumentsForOpenApiMethods.mockReturnValue([
        '',
        undefined,
        undefined,
        { context: EnabledAuthContext },
      ]);
      insurancesApiService.getInsurancesEncouragementForProduct.mockReturnValue(
        response,
      );

      expect(
        effects.getProductInsurancesEncouragementsForCart$,
      ).toSatisfyOnFlush(() => {
        expect(
          insurancesApiService.getInsurancesEncouragementForProduct,
        ).toHaveBeenCalled();
        expect(
          effects.getProductInsurancesEncouragementsForCart$,
        ).toBeObservable(expected);
      });
    });

    test('returns getProductInsurancesEncouragementsForCartFail action on fail', () => {
      const action = fromCartActions.getProductInsurancesEncouragementsForCart({
        payload,
      });
      const completion =
        fromCartActions.getProductInsurancesEncouragementsForCartFail({
          payload: {
            error: {} as ApiError,
          },
        });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });

      insurancesDataService.prepareArgumentsForOpenApiMethods.mockReturnValue([
        '',
        undefined,
        undefined,
        { context: EnabledAuthContext },
      ]);
      insurancesApiService.getInsurancesEncouragementForProduct.mockReturnValue(
        response,
      );

      expect(
        effects.getProductInsurancesEncouragementsForCart$,
      ).toSatisfyOnFlush(() => {
        expect(
          insurancesApiService.getInsurancesEncouragementForProduct,
        ).toHaveBeenCalled();
        expect(
          effects.getProductInsurancesEncouragementsForCart$,
        ).toBeObservable(expected);
      });
    });
  });

  describe('addCartItemSuccess$', () => {
    const payload: AddCartItemSuccessPayload = {
      productPlu: '',
      accessoriesToCartAvailable: false,
      insuranceEncouragementAvailable: false,
      messageForUser: undefined,
      noRedirect: true,
      productLinkName: 'linkName',
    };

    test('calls getProductInsurancesEncouragementsForCart ', () => {
      jest.spyOn(fromCartActions, 'getProductInsurancesEncouragementsForCart');
      const action = fromCartActions.addCartItemSuccess({
        payload: {
          ...payload,
          insuranceEncouragementAvailable: true,
          productPlu: '123',
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: of(undefined) });

      expect(effects.addCartItemSuccess$).toSatisfyOnFlush(() => {
        expect(effects.addCartItemSuccess$).toBeObservable(expected);
        expect(
          fromCartActions.getProductInsurancesEncouragementsForCart,
        ).toHaveBeenCalled();
      });
    });

    test('calls getSetInsurancesEncouragementsForCart ', () => {
      jest.spyOn(fromCartActions, 'getSetInsurancesEncouragementsForCart');
      const action = fromCartActions.addCartItemSuccess({
        payload: {
          ...payload,
          insuranceEncouragementAvailable: true,
          dynamicSetAccessoriesIdentifier: '123',
        } as any,
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: of(undefined) });

      expect(effects.addCartItemSuccess$).toSatisfyOnFlush(() => {
        expect(effects.addCartItemSuccess$).toBeObservable(expected);
        expect(
          fromCartActions.getSetInsurancesEncouragementsForCart,
        ).toHaveBeenCalled();
      });
    });

    test('returns addCartItemSuccess with noRedirect: true on success', () => {
      const action = fromCartActions.addCartItemSuccess({ payload });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: of(undefined) });

      expect(effects.addCartItemSuccess$).toSatisfyOnFlush(() => {
        expect(effects.addCartItemSuccess$).toBeObservable(expected);
      });
    });

    test('returns addCartItemSuccess with noRedirect: false on success', () => {
      const action = fromCartActions.addCartItemSuccess({
        payload: { ...payload, noRedirect: false, redirectToCart: true },
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: of(undefined) });

      expect(effects.addCartItemSuccess$).toSatisfyOnFlush(() => {
        expect(effects.addCartItemSuccess$).toBeObservable(expected);
        expect(doc.location.href).toBe('cart.bhtml');
      });
    });

    test('returns addCartItemSuccess with noRedirect: false, accessoriesToCartAvailable: true on success', () => {
      const action = fromCartActions.addCartItemSuccess({
        payload: {
          ...payload,
          noRedirect: false,
          accessoriesToCartAvailable: true,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: of(undefined) });

      expect(effects.addCartItemSuccess$).toSatisfyOnFlush(() => {
        expect(effects.addCartItemSuccess$).toBeObservable(expected);
        expect(doc.location.href).toBe('linkName/to-cart.bhtml');
      });
    });

    test('returns addCartItemSuccess with noRedirect: false, accessoriesToCartAvailable: true, dynamicSetAccessoriesIdentifier in payload on success', () => {
      const action = fromCartActions.addCartItemSuccess({
        payload: {
          ...payload,
          noRedirect: false,
          accessoriesToCartAvailable: true,
          dynamicSetAccessoriesIdentifier: 'identifier',
        } as any,
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: payload });
      const expected = cold('---c', { c: of(undefined) });

      expect(effects.addCartItemSuccess$).toSatisfyOnFlush(() => {
        expect(effects.addCartItemSuccess$).toBeObservable(expected);
        expect(doc.location.href).toBe('pakiet-identifier/to-cart.bhtml');
      });
    });
  });
});
