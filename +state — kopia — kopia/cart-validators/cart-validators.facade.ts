import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { cartValidatorsQuery } from './cart-validators.selectors';

@Injectable()
export class CartValidatorsFacade {
  isCartItemLimitAcquired$ = this.store.pipe(
    select(cartValidatorsQuery.isCartItemLimitAcquired)
  );
  isCartItemQuantityLimitAcquiredMap$ = this.store.pipe(
    select(cartValidatorsQuery.isCartItemQuantityLimitAcquiredMap)
  );

  constructor(private readonly store: Store) {}

  isCartItemQuantityLimitAcquired$ = (plu: string) =>
    this.store.pipe(
      select(cartValidatorsQuery.isCartItemQuantityLimitAcquired(plu))
    );
  isCartItemInTheCart$ = (plu: string) =>
    this.store.pipe(select(cartValidatorsQuery.isCartItemInTheCart(plu)));

  isOutletCopyInTheCart$ = (huCode: string) =>
    this.store.pipe(select(cartValidatorsQuery.isOutletCopyInTheCart(huCode)));
}
