import { NgModule } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { CartSettingsFacade } from '../cart-settings/cart-settings.facade';
import { CartValidatorsFacade } from '../cart-validators/cart-validators.facade';
import {
  AddCartItemPayload,
  AddedItemFromType,
  AddPackagePayload,
  CartProduct,
  DeliveryDate,
  GetServicesPayload,
  ServiceGroup,
  UpdateDeliveryTimePayload,
} from '@ems/euro-mobile/cart/domain';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createSpyObj } from 'jest-createspyobj';
import { Observable, of } from 'rxjs';
import { ServicesFacade } from '../services/services.facade';
import { fromCartActions } from './cart.actions';
import { CartFacade } from './cart.facade';
import { EuiCookbarService } from '@spektrum/addon-messages';

describe('CartFacade', () => {
  let facade: CartFacade;
  let store: MockStore;
  let servicesFacade: ServicesFacade;

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [],
        providers: [CartFacade, provideMockStore(), ServicesFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [CustomFeatureModule],
        providers: [
          {
            provide: CartSettingsFacade,
            useValue: {
              ...createSpyObj(CartSettingsFacade),
              getCartItemQuantityLimitError$: of(''),
              getCartItemLimitError$: of(''),
            },
          },
          {
            provide: EuiCookbarService,
            useValue: {
              ...createSpyObj(EuiCookbarService),
            },
          },
          {
            provide: CartValidatorsFacade,
            useValue: {
              ...createSpyObj(CartValidatorsFacade),
              isCartItemQuantityLimitAcquired$: () => of(false),
              isCartItemLimitAcquired$: of(false),
            },
          },
        ],
      })
      class RootModule {}

      TestBed.configureTestingModule({ imports: [RootModule] });
      facade = TestBed.inject(CartFacade);
      store = TestBed.inject(MockStore);
      servicesFacade = TestBed.inject(ServicesFacade);
      jest.spyOn(store, 'dispatch');
    });

    describe('#addCartItem', () => {
      test('should dispatch fromCartActions.addCartItem action', () => {
        const payload = {
          identifiers: {
            plu: '123',
            productLinkName: undefined,
            productGroupLinkName: undefined,
          },
          price: 12,
          image: [],
          name: 'cartItem',
          productGroup: 'test',
        } as AddCartItemPayload;
        const action = fromCartActions.addCartItem({ payload });

        facade.addCartItem(payload);
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#addPackage', () => {
      test('should dispatch fromCartActions.addPackage action', () => {
        const payload = {
          identifiers: {
            plu: '123',
            productLinkName: undefined,
            productGroupLinkName: undefined,
          },
          price: 12,
          image: [],
          name: 'cartItem',
          productGroup: 'test',
          packageElements: [],
        } as AddPackagePayload;
        const action = fromCartActions.addPackage({ payload });

        facade.addPackage(payload);
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#addAccessoryToCart', () => {
      test('should dispatch fromCartActions.addCartItem action', () => {
        const payload = {
          identifiers: {
            plu: '123',
          },
          addedFrom: AddedItemFromType.PRODUCT_CARD,
          noRedirect: true,
        } as AddCartItemPayload;
        const action = fromCartActions.addCartItem({ payload });

        facade.addAccessoryToCart('123');
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#getDeliveryTimeCollection', () => {
      test('should dispatch fromCartActions.getDeliveryTimeCollection action', () => {
        const action = fromCartActions.getDeliveryTimeCollection();

        facade.getDeliveryTimeCollection();
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#updateDeliveryTime', () => {
      test('should dispatch fromCartActions.updateDeliveryTime action', () => {
        const payload: UpdateDeliveryTimePayload = {
          deliveryTime: {} as never,
        };
        const action = fromCartActions.updateDeliveryTime({ payload });

        facade.updateDeliveryTime(payload);
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#getZipCodeFromCoordinates', () => {
      test('should dispatch fromCartActions.getZipCodeFromCoordinates action', () => {
        const action = fromCartActions.getZipCodeFromCoordinates();

        facade.getZipCodeFromCoordinates();
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#getZipCodeFilteredPossibleCityCollection$', () => {
      it('should return filtered cities', waitForAsync(() => {
        facade.zipCodePossibleCityCollection$ = of(['lorem', 'ipsum', 'dolor']);
        const filteredCities = facade.getZipCodeFilteredPossibleCityCollection$(
          of('lor'),
        );

        filteredCities.subscribe((cities) => {
          expect(cities).toEqual([{ name: 'lorem' }, { name: 'dolor' }]);
        });
      }));

      it('should return empty array', waitForAsync(() => {
        facade.zipCodePossibleCityCollection$ = of(['lorem', 'ipsum', 'dolor']);
        const filteredCities = facade.getZipCodeFilteredPossibleCityCollection$(
          of('test'),
        );

        filteredCities.subscribe((cities) => {
          expect(cities).toEqual([]);
        });
      }));
    });

    describe('#getCheapestPriceForDeliveryTimeCollection', () => {
      it('should from to false when one date', waitForAsync(() => {
        facade.deliveryTimeCollection$ = of([
          {
            deliveryDate: new Date(),
            deliveryDatePrice: 0,
            deliveryHoursDetails: [],
            availableServices: [],
          },
        ]);
        facade
          .getCheapestPriceForDeliveryTimeCollection$()
          .subscribe((response) => {
            expect(response.from).toBeFalsy();
          });
      }));
      it('should from to false when only one price', waitForAsync(() => {
        facade.deliveryTimeCollection$ = of([
          {
            deliveryDate: new Date(),
            deliveryDatePrice: 0,
            deliveryHoursDetails: [],
            availableServices: [],
          },
        ]);
        facade
          .getCheapestPriceForDeliveryTimeCollection$()
          .subscribe((response) => {
            expect(response.from).toBeFalsy();
          });
      }));

      it('should return true when more than one price', waitForAsync(() => {
        facade.deliveryTimeCollection$ = of([
          {
            deliveryDate: new Date(),
            deliveryDatePrice: 0,
            deliveryHoursDetails: [],
            availableServices: [],
          },
          {
            deliveryDate: new Date(),
            deliveryDatePrice: 1,
            deliveryHoursDetails: [],
            availableServices: [],
          },
        ]);
        facade
          .getCheapestPriceForDeliveryTimeCollection$()
          .subscribe((response) => {
            expect(response.from).toBeTruthy();
          });
      }));

      it('should return price: 0', waitForAsync(() => {
        facade.deliveryTimeCollection$ = of([
          {
            deliveryDate: new Date(),
            deliveryDatePrice: 0,
            deliveryHoursDetails: [],
            availableServices: [],
          },
          {
            deliveryDate: new Date(),
            deliveryDatePrice: 1,
            deliveryHoursDetails: [],
            availableServices: [],
          },
        ]);
        facade
          .getCheapestPriceForDeliveryTimeCollection$()
          .subscribe((response) => {
            expect(response.price).toEqual(0);
          });
      }));

      it('should return price: 0', waitForAsync(() => {
        facade.deliveryTimeCollection$ = of([
          {
            deliveryDate: new Date(),
            deliveryDatePrice: 1,
            deliveryHoursDetails: [],
            availableServices: [],
          },
          {
            deliveryDate: new Date(),
            deliveryDatePrice: 2,
            deliveryHoursDetails: [],
            availableServices: [],
          },
        ]);
        facade
          .getCheapestPriceForDeliveryTimeCollection$()
          .subscribe((response) => {
            expect(response.price).toEqual(0);
          });
      }));

      it('should return price: 0 when no price', waitForAsync(() => {
        facade.deliveryTimeCollection$ = of([
          {
            deliveryDate: new Date(),
            deliveryHoursDetails: [],
          },
          {
            deliveryDate: new Date(),
            deliveryHoursDetails: [],
          },
        ]) as Observable<DeliveryDate[]>;
        facade
          .getCheapestPriceForDeliveryTimeCollection$()
          .subscribe((response) => {
            expect(response.price).toEqual(0);
          });
      }));
    });

    describe('#getCheapestPriceForServiceGroup', () => {
      test('should call servicesFacade', () => {
        const serviceGroup: ServiceGroup = {
          id: '1',
          deliveryNameRequirement: null,
          services: [
            {
              description: '',
              name: '',
              servicePlu: '123',
              price: 0,
              checked: false,
              deliveryTypeCodeExclusions: [],
              logisticAreaRegexp: null,
            },
          ],
        };

        jest.spyOn(servicesFacade, 'getCheapestPriceForServiceGroup');
        facade.getCheapestPriceForServiceGroup(serviceGroup);
        expect(
          servicesFacade.getCheapestPriceForServiceGroup,
        ).toHaveBeenCalledWith(serviceGroup);
      });
    });

    describe('#getServices', () => {
      test('should call servicesFacade', () => {
        const payload: GetServicesPayload = {
          productPlu: ['1', '2'],
        };

        jest.spyOn(servicesFacade, 'getServices');
        facade.getServices(payload);
        expect(servicesFacade.getServices).toHaveBeenCalledWith(payload);
      });
    });

    describe('#getProductsServices', () => {
      const cartItems = [
        {
          identifiers: {
            plu: '1217118',
            productGroupLinkName: undefined,
            productLinkName: undefined,
          },
          quantity: 1,
          warehouse: null,
          price: 1299,
          images: [],
          name: 'Toshiba TW-BJ90S2PL',
          productGroup: 'Pralki',
          productName: 'pralka',
          productNumber: '1',
          warranties: [],
          partnerService: [],
          services: [],
          assignedServices: [
            {
              name: 'nazwa usługi',
              price: 12,
              serviceDiscountPrice: 15,
              plu: '323232323222',
            },
            {
              name: 'nazwa usługi',
              price: 9.99,
              plu: '123',
            },
            {
              name: 'nazwa usługi',
              price: 12,
              plu: '323232323222',
            },
          ],
        },
        {
          identifiers: {
            plu: '1224437',
            productGroupLinkName: undefined,
            productLinkName: undefined,
          },
          quantity: 2,
          warehouse: null,
          price: 2999,
          images: [],
          name: 'vivo X51 5G (szary)',
          productGroup: 'Smartfony i telefony',
          productName: 'pralka',
          warranties: [],
          partnerService: [],
          services: [],
          assignedServices: [
            {
              name: 'nazwa usługi',
              price: 12,
              serviceDiscountPrice: 15,
              plu: '323232323222',
            },
            {
              name: 'nazwa usługi',
              price: 9.99,
              plu: '123',
            },
          ],
        },
        {
          identifiers: {
            plu: '1224437',
            productGroupLinkName: undefined,
            productLinkName: undefined,
          },
          quantity: 2,
          warehouse: null,
          price: 2999,
          images: [],
          name: 'vivo X51 5G (szary)',
          productGroup: 'Smartfony i telefony',
          productName: 'pralka',
          warranties: [],
          partnerService: [],
          services: [],
          assignedServices: [
            {
              productNumber: 1,
              services: [
                {
                  name: 'nazwa usługi',
                  price: 12,
                  serviceDiscountPrice: 15,
                  id: '323232323222',
                },
                {
                  name: 'nazwa usługi',
                  price: 9.99,
                  id: '123',
                },
              ],
            },
            {
              productNumber: 2,
              services: [
                {
                  name: 'nazwa usługi',
                  price: 12,
                  id: '323232323222',
                },
              ],
            },
          ],
        },
      ];
      it('should map cartItems to product services', waitForAsync(() => {
        facade.cartItems$ = of(cartItems) as Observable<CartProduct[]>;
        facade.getProductsServices$().subscribe((response) => {
          expect(response[0].services.length).toEqual(3);
          expect(response[1].services.length).toEqual(2);
          expect(response[2].services.length).toEqual(2);
        });
        facade.anyProductServices$().subscribe((response) => {
          expect(response).toBe(true);
        });
      }));
      it('should return empty product services', waitForAsync(() => {
        facade.cartItems$ = of([]) as Observable<CartProduct[]>;
        facade.getProductsServices$().subscribe((response) => {
          expect(response.length).toEqual(0);
        });
        facade.anyProductServices$().subscribe((response) => {
          expect(response).toBe(false);
        });
      }));
      it('should not start searching services in assignedServices', waitForAsync(() => {
        facade.cartItems$ = of([
          {
            identifiers: {
              plu: '1217118',
              productGroupLinkName: undefined,
              productLinkName: undefined,
            },
            quantity: 1,
            warehouse: null,
            price: 1299,
            images: [],
            name: 'Toshiba TW-BJ90S2PL',
            productGroup: 'Pralki',
            productName: 'pralka',
            productNumber: '1',
            warranties: [],
            partnerService: [],
            services: [],
            assignedServices: [],
          },
        ]) as Observable<CartProduct[]>;
        facade.getProductsServices$().subscribe((response) => {
          expect(response[0].services.length).toEqual(0);
        });
        facade.anyProductServices$().subscribe((response) => {
          expect(response).toBe(false);
        });
      }));
      it('should not find assigned service when index is not matched', waitForAsync(() => {
        facade.cartItems$ = of([
          {
            identifiers: {
              plu: '1217118',
              productGroupLinkName: undefined,
              productLinkName: undefined,
            },
            quantity: 1,
            warehouse: null,
            price: 1299,
            images: [],
            name: 'Toshiba TW-BJ90S2PL',
            productGroup: 'Pralki',
            productName: 'pralka',
            productNumber: '1',
            warranties: [],
            partnerService: [],
            services: [],
            assignedServices: [
              {
                name: 'nazwa usługi',
                price: 12,
                serviceDiscountPrice: 15,
                plu: '323232323222',
              },
              {
                name: 'nazwa usługi',
                price: 9.99,
                plu: '123',
              },
            ],
          },
        ]) as Observable<CartProduct[]>;
        facade.getProductsServices$().subscribe((response) => {
          expect(response[0].services.length).toEqual(2);
        });
        facade.anyProductServices$().subscribe((response) => {
          expect(response).toBe(true);
        });
      }));
    });
  });
});
