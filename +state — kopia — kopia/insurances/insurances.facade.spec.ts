import { NgModule } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  GetRecommendedInsurancesSuccessPayload,
  RecommendedInsuranceForCategory,
} from '@ems/euro-mobile/cart/domain';

import {
  InsuranceCategory,
  InsurancePaymentType,
  InsurancesOrServicesPrice,
} from '@ems/euro-mobile/shared/domain';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { CartIdFacade, InsurancesFacade } from '../../../index';
import { fromCartActions } from '../cart/cart.actions';

describe('InsurancesFacade', () => {
  let facade: InsurancesFacade;
  let store: MockStore;

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [],
        providers: [provideMockStore(), InsurancesFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [CustomFeatureModule],
        providers: [],
      })
      class RootModule {}

      TestBed.configureTestingModule({
        imports: [RootModule],
        providers: [MockProvider(CartIdFacade)],
      });
      facade = TestBed.inject(InsurancesFacade);
      store = TestBed.inject(MockStore);
      jest.spyOn(store, 'dispatch');
    });

    describe('getRecommendedInsurances', () => {
      it('should dispatch getRecommendedInsurances action', () => {
        const payload = { productPlu: '' };
        facade.getRecommendedInsurances(payload);

        const expected = fromCartActions.getRecommendedInsurances({ payload });
        expect(store.dispatch).toHaveBeenCalledWith(expected);
      });
    });

    describe('getInsurancePriceObject', () => {
      beforeEach(() => {
        facade.insurancesEncouragements$ = of({
          encouragementInsurancesForPaymentTypes: [
            {
              paymentType: InsurancePaymentType.TenTimes,
              encouragementInsurancesForCategories: [
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurances: [
                    {
                      id: 2,
                      insurancePeriodDescription: 'abc',
                    },
                  ],
                },
              ],
            },
            {
              paymentType: InsurancePaymentType.Instalment,
              encouragementInsurancesForCategories: [
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurances: [
                    {
                      id: 2,
                      insurancePeriodDescription: 'abc',
                    },
                  ],
                },
              ],
            },
            {
              paymentType: InsurancePaymentType.OneTime,
              encouragementInsurancesForCategories: [
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurances: [
                    {
                      id: 2,
                      insurancePeriodDescription: 'abc',
                    },
                  ],
                },
              ],
            },
            {
              paymentType: InsurancePaymentType.Subscription,
              encouragementInsurancesForCategories: [
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurances: [
                    {
                      id: 2,
                      insurancePeriodDescription: 'abc',
                    },
                  ],
                },
              ],
            },
          ],
        }) as any;
      });
      it('should return price format for paymentType ten times', (done) => {
        const insurance: RecommendedInsuranceForCategory = {
          category: InsuranceCategory.BASIC_PROTECTION,
          insurance: {
            id: 2,
            instalment: null,
            insuranceVariantDescription: '',
            numberOfInstallments: 10,
            paymentType: InsurancePaymentType.TenTimes,
            price: 100,
            simpleName: '',
            promotionMessage: '',
          },
        };
        const response = facade.getInsurancePriceObject(insurance, false);
        const expected: InsurancesOrServicesPrice = {
          price: 100,
          paymentType: InsurancePaymentType.TenTimes,
          htmlDescription: 'abc',
        };

        response.subscribe((res) => {
          expect(res).toEqual(expected);
          done();
        });
      });

      it('should return price format for paymentType subscription', (done) => {
        const insurance: RecommendedInsuranceForCategory = {
          category: InsuranceCategory.BASIC_PROTECTION,
          insurance: {
            id: 2,
            instalment: null,
            insuranceVariantDescription: '',
            numberOfInstallments: 10,
            paymentType: InsurancePaymentType.Subscription,
            price: 100,
            simpleName: '',
            promotionMessage: '',
          },
        };
        const response = facade.getInsurancePriceObject(insurance, false);
        const expected: InsurancesOrServicesPrice = {
          price: 100,
          paymentType: InsurancePaymentType.Subscription,
          htmlDescription: 'abc',
        };

        response.subscribe((res) => {
          expect(res).toEqual(expected);
          done();
        });
      });

      it('should return price format for paymentType one time', (done) => {
        const insurance: RecommendedInsuranceForCategory = {
          category: InsuranceCategory.BASIC_PROTECTION,
          insurance: {
            id: 2,
            instalment: null,
            insuranceVariantDescription: '',
            numberOfInstallments: 10,
            paymentType: InsurancePaymentType.OneTime,
            price: 100,
            simpleName: '',
            promotionMessage: '',
          },
        };
        const response = facade.getInsurancePriceObject(insurance, false);
        const expected: InsurancesOrServicesPrice = {
          price: 100,
          paymentType: InsurancePaymentType.OneTime,
          htmlDescription: 'abc',
        };

        response.subscribe((res) => {
          expect(res).toEqual(expected);
          done();
        });
      });

      it('should return price format for paymentType instalment', (done) => {
        const insurance: RecommendedInsuranceForCategory = {
          category: InsuranceCategory.BASIC_PROTECTION,
          insurance: {
            id: 2,
            instalment: {
              code: '',
              instalmentPrice: 10,
              loanInterest: 10,
              numberOfInstalments: 30,
            },
            insuranceVariantDescription: '',
            numberOfInstallments: 10,
            paymentType: InsurancePaymentType.TenTimes,
            price: 100,
            simpleName: '',
            promotionMessage: '',
          },
        };
        const response = facade.getInsurancePriceObject(insurance, true);
        const expected: InsurancesOrServicesPrice = {
          price: 10,
          numberOfInstalments: 30,
          loanInterest: 10,
          paymentType: InsurancePaymentType.Instalment,
          htmlDescription: 'abc',
        };

        response.subscribe((res) => {
          expect(res).toEqual(expected);
          done();
        });
      });

      it('should return price format for paymentType instalment', (done) => {
        const insurance: RecommendedInsuranceForCategory = {
          category: InsuranceCategory.BASIC_PROTECTION,
          insurance: {
            id: 2,
            instalment: {
              code: '',
              instalmentPrice: 10,
              loanInterest: null,
              numberOfInstalments: 30,
            },
            insuranceVariantDescription: '',
            numberOfInstallments: 10,
            paymentType: InsurancePaymentType.TenTimes,
            price: 100,
            simpleName: '',
            promotionMessage: '',
          },
        };
        const response = facade.getInsurancePriceObject(insurance, true);
        const expected: InsurancesOrServicesPrice = {
          price: 10,
          numberOfInstalments: 30,
          loanInterest: 0,
          paymentType: InsurancePaymentType.Instalment,
          htmlDescription: 'abc',
        };

        response.subscribe((res) => {
          expect(res).toEqual(expected);
          done();
        });
      });
    });

    describe('getInsuranceIcon', () => {
      it('should return pg-basic for InsuranceCategory.BASIC_PROTECTION', () => {
        const insurance: RecommendedInsuranceForCategory = {
          category: InsuranceCategory.BASIC_PROTECTION,
          insurance: null,
        };

        const response = facade.getInsuranceIcon(insurance.category);
        expect(response).toEqual('pg-basic');
      });

      it('should return pg-full for FULL_PROTECTION', () => {
        const insurance: RecommendedInsuranceForCategory = {
          category: InsuranceCategory.FULL_PROTECTION,
          insurance: null,
        };

        const response = facade.getInsuranceIcon(insurance.category);
        expect(response).toEqual('pg-full');
      });

      it('should return pg-basic by default', () => {
        const insurance: RecommendedInsuranceForCategory = {
          category: InsuranceCategory.EXTENDED_PROTECTION,
          insurance: null,
        };

        const response = facade.getInsuranceIcon(insurance.category);
        expect(response).toEqual('pg-basic');
      });
    });

    describe('initSortedRecommenedInsurances', () => {
      // @todo test
      it('should return first two insurances based on display order', () => {
        const recommendedInsurances: GetRecommendedInsurancesSuccessPayload = {
          insuranceForProductGrupDescription: '',
          paymentTypesDisplayOrder: [
            InsurancePaymentType.OneTime,
            InsurancePaymentType.Subscription,
            InsurancePaymentType.TenTimes,
          ],
          recommendedInsurancesForPaymentType: [
            {
              paymentType: InsurancePaymentType.OneTime,
              recommendedInsuranceForCategories: [
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 1,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.OneTime,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 2,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.OneTime,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 3,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.OneTime,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
              ],
            },
          ],
        };
        const response = facade.initSortedRecommenedInsurances(
          recommendedInsurances,
        );
        expect(response.length).toEqual(2);
        expect(response[0].insurance.id).toEqual(1);
        expect(response[1].insurance.id).toEqual(2);
      });

      it('should return insurance with paymentType TEN_TIMES', () => {
        const recommendedInsurances: GetRecommendedInsurancesSuccessPayload = {
          insuranceForProductGrupDescription: '',
          paymentTypesDisplayOrder: [
            InsurancePaymentType.TenTimes,
            InsurancePaymentType.OneTime,
            InsurancePaymentType.Subscription,
          ],
          recommendedInsurancesForPaymentType: [
            {
              paymentType: InsurancePaymentType.OneTime,
              recommendedInsuranceForCategories: [
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 1,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.OneTime,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 2,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.OneTime,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 3,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.OneTime,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
              ],
            },
            {
              paymentType: InsurancePaymentType.TenTimes,
              recommendedInsuranceForCategories: [
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 3,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.TenTimes,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
              ],
            },
          ],
        };
        const response = facade.initSortedRecommenedInsurances(
          recommendedInsurances,
        );
        expect(response.length).toEqual(1);
        expect(response[0].insurance.id).toEqual(3);
      });

      it('should return insurance with paymentType ONE_TIME', () => {
        const recommendedInsurances: GetRecommendedInsurancesSuccessPayload = {
          insuranceForProductGrupDescription: '',
          paymentTypesDisplayOrder: [
            InsurancePaymentType.TenTimes,
            InsurancePaymentType.OneTime,
            InsurancePaymentType.Subscription,
          ],
          recommendedInsurancesForPaymentType: [
            {
              paymentType: InsurancePaymentType.OneTime,
              recommendedInsuranceForCategories: [
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 1,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.OneTime,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 2,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.OneTime,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 3,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.OneTime,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
              ],
            },
            {
              paymentType: InsurancePaymentType.TenTimes,
              recommendedInsuranceForCategories: [
                {
                  category: InsuranceCategory.BASIC_PROTECTION,
                  insurance: {
                    id: 3,
                    instalment: null,
                    insuranceVariantDescription: '',
                    numberOfInstallments: 10,
                    paymentType: InsurancePaymentType.TenTimes,
                    price: 10,
                    simpleName: '',
                    promotionMessage: '',
                  },
                },
              ],
            },
          ],
        };
        const response = facade.initSortedRecommenedInsurances(
          recommendedInsurances,
          true,
        );
        expect(response.length).toEqual(2);
        expect(response[0].insurance.id).toEqual(1);
        expect(response[1].insurance.id).toEqual(2);
      });

      it('should return empty array', () => {
        const recommendedInsurances: GetRecommendedInsurancesSuccessPayload = {
          insuranceForProductGrupDescription: '',
          paymentTypesDisplayOrder: [
            InsurancePaymentType.TenTimes,
            InsurancePaymentType.OneTime,
            InsurancePaymentType.Subscription,
          ],
          recommendedInsurancesForPaymentType: [
            {
              paymentType: InsurancePaymentType.OneTime,
              recommendedInsuranceForCategories: null,
            },
            {
              paymentType: InsurancePaymentType.TenTimes,
              recommendedInsuranceForCategories: null,
            },
          ],
        };
        const response = facade.initSortedRecommenedInsurances(
          recommendedInsurances,
        );
        expect(response.length).toEqual(0);
      });
    });

    describe('handleInsurancePopUpClosed', () => {
      it('should call addInsuranceToCartItem', fakeAsync(() => {
        facade.redirectToCartPayload$ = of({
          accessoriesToCartAvailable: false,
          productPlu: '',
          insuranceConflict: false,
        } as any);

        jest.spyOn(facade, 'addInsuranceToCartItem');

        facade.handleInsurancePopUpClosed({
          checkedId: 100,
          paymentType: InsurancePaymentType.OneTime,
        });

        tick();

        expect(facade.addInsuranceToCartItem).toHaveBeenCalledTimes(1);
      }));

      it('should call addInsuranceToSet', fakeAsync(() => {
        facade.redirectToCartPayload$ = of({
          accessoriesToCartAvailable: false,
          dynamicSetAccessoriesIdentifier: '123',
          insuranceConflict: false,
        } as any);

        jest.spyOn(facade, 'addInsuranceToSet');

        facade.handleInsurancePopUpClosed({
          checkedId: 100,
          paymentType: InsurancePaymentType.OneTime,
        });

        tick();

        expect(facade.addInsuranceToSet).toHaveBeenCalledTimes(1);
      }));

      it('should call goToCart', fakeAsync(() => {
        facade.redirectToCartPayload$ = of({
          accessoriesToCartAvailable: false,
          dynamicSetAccessoriesIdentifier: '123',
          insuranceConflict: false,
        } as any);

        jest.spyOn(facade, 'goToCart');

        facade.handleInsurancePopUpClosed(null);

        tick();

        expect(facade.goToCart).toHaveBeenCalledTimes(1);
      }));
    });
  });
});
