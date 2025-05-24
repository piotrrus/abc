import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CartSettingsFacade } from './cart-settings.facade';
import { fromCartSettingsActions } from './cart-settings.actions';

describe('CartSettingsFacade', () => {
  let facade: CartSettingsFacade;
  let store: MockStore;

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        providers: [CartSettingsFacade, provideMockStore()],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [CustomFeatureModule],
      })
      class RootModule {}

      TestBed.configureTestingModule({ imports: [RootModule] });
      facade = TestBed.inject(CartSettingsFacade);
      store = TestBed.inject(MockStore);
      jest.spyOn(store, 'dispatch');
    });

    describe('#getCartSettingsCollection', () => {
      test('should dispatch fromCartSettingsActions.getCartSettingsCollection action', () => {
        const action = fromCartSettingsActions.getCartSettingsCollection();

        facade.getCartSettingsCollection();
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });
  });
});
