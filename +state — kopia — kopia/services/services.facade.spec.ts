import { NgModule } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  Cart,
  GetServicesPayload,
  ServiceGroup,
} from '@ems/euro-mobile/cart/domain';
import { DeliveryTypeEnum } from '@ems/euro-mobile/dictionary/domain';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { fromCartActions } from '../cart/cart.actions';
import { ServicesFacade } from './services.facade';
import { FeatureFlagService } from '@ems/shared/util-feature-flag';
import { InsurancePaymentType } from '@ems/euro-mobile/shared/domain';

let flagEnabled = false;

const ffServiceMock = {
  getFeature: () => {
    return flagEnabled;
  },
};

describe('CartFacade', () => {
  let facade: ServicesFacade;
  let store: MockStore;

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [],
        providers: [
          provideMockStore(),
          ServicesFacade,
          { provide: FeatureFlagService, useValue: ffServiceMock },
        ],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [CustomFeatureModule],
        providers: [],
      })
      class RootModule {}

      TestBed.configureTestingModule({ imports: [RootModule] });
      facade = TestBed.inject(ServicesFacade);
      store = TestBed.inject(MockStore);
      jest.spyOn(store, 'dispatch');
    });

    describe('#getCheapestPriceForServiceGroup', () => {
      test('should return price 1 and hasMultiplePrices false', () => {
        const serviceGroup: ServiceGroup = {
          id: 'sdsds',
          deliveryNameRequirement: null,
          services: [
            {
              description: '',
              name: '',
              servicePlu: '123',
              price: 1,
              checked: false,
              deliveryTypeCodeExclusions: [],
              logisticAreaRegexp: null,
            },
          ],
        };

        const result = facade.getCheapestPriceForServiceGroup(serviceGroup);

        expect(result.hasMultiplePrices).toBeFalsy();
        expect(result.price).toBe(1);
      });

      test('should return price 1 and hasMultiplePrices false', () => {
        const serviceGroup: ServiceGroup = {
          deliveryNameRequirement: null,
          id: 'vvvv',
          services: [
            {
              description: '',
              name: '',
              servicePlu: '123',
              price: 1,
              checked: false,
              deliveryTypeCodeExclusions: [],
              logisticAreaRegexp: null,
            },
            {
              description: '',
              name: '',
              servicePlu: '123',
              price: 1,
              promotionalPrice: {
                fromDatetime: new Date().toDateString(),
                toDatetime: new Date().toDateString(),
                price: 1,
              },
              checked: false,
              deliveryTypeCodeExclusions: [],
              logisticAreaRegexp: null,
            },
          ],
        };

        const result = facade.getCheapestPriceForServiceGroup(serviceGroup);

        expect(result.hasMultiplePrices).toBeFalsy();
        expect(result.price).toBe(1);
      });

      test('should return price 1 and hasMultiplePrices true', () => {
        const serviceGroup: ServiceGroup = {
          id: 'asd',
          deliveryNameRequirement: null,
          services: [
            {
              description: '',
              name: '',
              servicePlu: '123',
              price: 3,
              checked: false,
              deliveryTypeCodeExclusions: [],
              logisticAreaRegexp: null,
            },
            {
              description: '',
              name: '',
              servicePlu: '123',
              price: 1,
              checked: false,
              deliveryTypeCodeExclusions: [],
              logisticAreaRegexp: null,
            },
          ],
        };

        const result = facade.getCheapestPriceForServiceGroup(serviceGroup);
        expect(result.hasMultiplePrices).toBeTruthy();
        expect(result.price).toBe(1);
      });
    });

    describe('getCheapestPriceForServiceGroup with installment tab', () => {
      it('should return price 1 and hasMultiplePrices true', () => {
        const serviceGroup: ServiceGroup = {
          id: 'asd',
          deliveryNameRequirement: null,
          services: [
            {
              description: '',
              name: '',
              servicePlu: '123',
              price: 3,
              checked: false,
              deliveryTypeCodeExclusions: [],
              logisticAreaRegexp: null,
            },
            {
              description: '',
              name: '',
              servicePlu: '123',
              price: 1,
              checked: false,
              deliveryTypeCodeExclusions: [],
              logisticAreaRegexp: null,
            },
          ],
        };

        const result = facade.getCheapestPriceForServiceGroup(
          serviceGroup,
          true,
        );
        expect(result.hasMultiplePrices).toBeTruthy();
        expect(result.price).toBe(1);
      });
    });

    describe('#getServices', () => {
      test('should call servicesFacade', () => {
        const payload: GetServicesPayload = {
          productPlu: ['1', '2'],
        };
        const action = fromCartActions.getServices({ payload });
        facade.getServices(payload);

        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('getExcludedServices', () => {
      let cart$: Observable<Cart>;
      beforeEach(() => {
        cart$ = of({
          delivery: null,
          products: [
            {
              images: null,
              productNumbers: [],
              name: '',
              plu: '3333',
              identifiers: {
                plu: '3333',
                productLinkName: undefined,
                productGroupLinkName: undefined,
              },
              price: 0,
              productGroup: '',
              productName: '',
              productNumber: '1',
              quantity: 1,
              assignedServices: [
                {
                  name: '',
                  price: 0,
                  plu: '1',
                },
                {
                  plu: '2',
                  name: '',
                  price: 0,
                },
              ],
            },
          ],
          payment: null,
          orderNumber: '',
          shopCode: null,
          orderDetails: null,
          deliveryTimeMessage: '',
        });

        facade.services$ = of([
          {
            descriptionStyleFile: '',
            partnerSubscriptionGroups: [],
            serviceGroups: [
              {
                label: '',
                id: '',
                deliveryNameRequirement: null,
                services: [
                  {
                    description: '',
                    name: 'nazwa usługi',
                    servicePlu: '1',
                    price: 12,
                    logisticAreaRegexp: null,
                    deliveryTypeCodeExclusions: [
                      { deliveryName: DeliveryTypeEnum.HOME },
                    ],
                  },
                  {
                    description: '',
                    name: 'name',
                    servicePlu: '123',
                    price: 8.9,
                    logisticAreaRegexp: null,
                    deliveryTypeCodeExclusions: [],
                  },
                ],
                description:
                  'Zużyty telewizor do oddania, drugi/inny sprzęt do oddania',
                name: 'Odbiór zużytego sprzętu',
              },
              {
                id: '232',
                label: '',
                deliveryNameRequirement: null,

                services: [
                  {
                    description: '',
                    name: 'name',
                    servicePlu: '2',
                    price: 20,
                    logisticAreaRegexp: null,
                    deliveryTypeCodeExclusions: [
                      { deliveryName: DeliveryTypeEnum.SHOP_RESERVATION },
                    ],
                  },
                  {
                    description: '',
                    name: 'name',
                    servicePlu: '12322434',
                    price: 10,
                    logisticAreaRegexp: null,
                    deliveryTypeCodeExclusions: [],
                  },
                ],
                description:
                  'Zużyty telewizor do oddania, drugi/inny sprzęt do oddania',
                name: 'Odbiór zużytego sprzętu',
              },
              {
                id: 'fdfdf',
                label: '',
                deliveryNameRequirement: null,

                services: [
                  {
                    description: '',
                    name: 'name',
                    servicePlu: '12323f',
                    price: 20,
                    logisticAreaRegexp: null,
                    deliveryTypeCodeExclusions: [],
                  },
                  {
                    description: '',
                    name: 'name',
                    servicePlu: '12322',
                    price: 10,
                    logisticAreaRegexp: null,
                    deliveryTypeCodeExclusions: [],
                  },
                ],
                description:
                  'Zużyty telewizor do oddania, drugi/inny sprzęt do oddania, Zużyty telewizor do oddania, drugi/inny sprzęt do oddania, Zużyty telewizor do oddania, drugi/inny sprzęt do oddania, Zużyty telewizor do oddania, drugi/inny sprzęt do oddania',
                name: 'Odbiór zużytego sprzętu',
              },
            ],
          },
        ]);
      });
      it('should return servicesExcludedForHome and servicesExcludedForShopReservation', waitForAsync(() => {
        facade.getExcludedServices(cart$).subscribe((res) => {
          expect(res.servicesExcludedForHome).toBeTruthy();
          expect(res.servicesExcludedForShopReservation).toBeTruthy();
          expect(res.servicesExcludedForHome.length).toEqual(1);
          expect(res.servicesExcludedForShopReservation.length).toEqual(1);
          expect(res.servicesExcludedForShopReservation[0].servicePlu).toEqual(
            '2',
          );
          expect(res.servicesExcludedForHome[0].servicePlu).toEqual('1');
        });
      }));
    });

    describe('getCheckedItemsForServiceGroup', () => {
      it('should return checked services', () => {
        const group = {
          services: [
            {
              name: 'name',
              price: 10,
              promotionalPrice: {
                fromDatetime: new Date().toDateString(),
                toDatetime: new Date().toDateString(),
                price: 5,
              },
              checked: true,
            },
            {
              name: 'name',
              price: 10,
              promotionalPrice: {
                fromDatetime: new Date().toDateString(),
                toDatetime: new Date().toDateString(),
                price: 5,
              },
              checked: false,
            },
          ],
        } as any;

        const response = facade.getCheckedItemsForServiceGroup(group);

        const expected = [
          {
            name: 'name',
            price: 10,
            promotionalPrice: 5,
          },
        ];

        expect(response).toEqual(expected);
      });

      it('should return checked services with installment data', () => {
        const group = {
          services: [
            {
              name: 'name',
              price: 10,
              promotionalPrice: {
                fromDatetime: new Date().toDateString(),
                toDatetime: new Date().toDateString(),
                price: 5,
              },
              instalment: {
                instalmentPrice: 100,
                numberOfInstalments: 10,
                loanInterest: 1,
                warrantyTooltipMessage: 'desc',
              },
              checked: true,
            },
            {
              name: 'name',
              price: 10,
              promotionalPrice: {
                fromDatetime: new Date().toDateString(),
                toDatetime: new Date().toDateString(),
                price: 5,
              },
              checked: false,
            },
          ],
        } as any;

        flagEnabled = true;
        const response = facade.getCheckedItemsForServiceGroup(group, true);

        const expected = [
          {
            name: 'name',
            price: 100,
            promotionalPrice: 5,
            htmlDescription: 'desc',
            loanInterest: 1,
            numberOfInstalments: 10,
            paymentType: InsurancePaymentType.Instalment,
          },
        ];

        expect(response).toEqual(expected);
      });
    });
  });
});
