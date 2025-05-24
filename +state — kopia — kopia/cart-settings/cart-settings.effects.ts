import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nx/angular';
import { fromCartSettingsActions } from './cart-settings.actions';
import { map } from 'rxjs/operators';
import { ApiError } from '@ems/shared/domain';
import { CartSettings } from '@ems/euro-mobile/cart/domain';
import { CartSettingsDataService } from '@ems/euro-mobile/cart/infrastructure';

@Injectable()
export class CartSettingsEffects {
  getCartSettingsCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartSettingsActions.getCartSettingsCollection),
      fetch({
        run: () => {
          return this.cartSettingsDataService.getCartSettingsCollection().pipe(
            map((data: CartSettings[]) =>
              fromCartSettingsActions.getCartSettingsCollectionSuccess({
                payload: { cartSettingsCollection: data },
              }),
            ),
          );
        },
        onError: (action, error: ApiError) => {
          return fromCartSettingsActions.getCartSettingsCollectionFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly cartSettingsDataService: CartSettingsDataService,
  ) {}
}
