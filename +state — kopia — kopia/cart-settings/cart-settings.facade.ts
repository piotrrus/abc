import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CartSettingsPartialState } from './cart-settings.reducer';
import { cartSettingsQuery } from './cart-settings.selectors';
import { fromCartSettingsActions } from './cart-settings.actions';

@Injectable()
export class CartSettingsFacade {
  getCartSettingsCollections$ = this.store.pipe(
    select(cartSettingsQuery.getCartSettingsCollection)
  );
  getCartItemQuantityLimitError$ = this.store.pipe(
    select(cartSettingsQuery.getCartItemQuantityLimitError)
  );
  getCartItemLimitError$ = this.store.pipe(
    select(cartSettingsQuery.getCartItemLimitError)
  );

  constructor(private readonly store: Store<CartSettingsPartialState>) {}

  getCartSettingsCollection(): void {
    this.store.dispatch(fromCartSettingsActions.getCartSettingsCollection());
  }
}
