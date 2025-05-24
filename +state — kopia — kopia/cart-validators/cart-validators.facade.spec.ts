import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CartValidatorsFacade } from './cart-validators.facade';
import { cartValidatorsQuery } from './cart-validators.selectors';

describe('CartValidatorsFacade', () => {
  let facade: CartValidatorsFacade;
  let store: MockStore;

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [],
        providers: [CartValidatorsFacade, provideMockStore()],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [CustomFeatureModule],
      })
      class RootModule {}

      TestBed.configureTestingModule({ imports: [RootModule] });
      facade = TestBed.inject(CartValidatorsFacade);
      store = TestBed.inject(MockStore);
      jest.spyOn(store, 'dispatch');
    });

    describe('#isCartItemQuantityLimitAcquired$', () => {
      test('should use isCartItemQuantityLimitAcquired selector with parameter', () => {
        const spy = jest.spyOn(
          cartValidatorsQuery,
          'isCartItemQuantityLimitAcquired'
        );
        facade.isCartItemQuantityLimitAcquired$('plu');
        expect(spy).toHaveBeenCalledWith('plu');
      });
    });

    describe('#isCartItemInTheCart$', () => {
      test('should use isCartItemQuantityLimitAcquired selector with parameter', () => {
        const spy = jest.spyOn(cartValidatorsQuery, 'isCartItemInTheCart');
        facade.isCartItemInTheCart$('plu');
        expect(spy).toHaveBeenCalledWith('plu');
      });
    });

    describe('#isOutletCopyInTheCart$', () => {
      test('should use isOutletCopyInTheCart selector with parameter', () => {
        const spy = jest.spyOn(cartValidatorsQuery, 'isOutletCopyInTheCart');
        facade.isOutletCopyInTheCart$('plu');
        expect(spy).toHaveBeenCalledWith('plu');
      });
    });
  });
});
