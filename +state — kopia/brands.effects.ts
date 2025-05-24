import { Injectable } from '@angular/core';
import { BrandsDataService } from '@ems/euro-mobile/product/brands/infrastructure';
import { ApiError } from '@ems/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nx/angular';
import { map } from 'rxjs/operators';
import { fromBrandsActions } from './brands.actions';

@Injectable()
export class BrandsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly brandsDataService: BrandsDataService,
  ) {}

  getBrandDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromBrandsActions.getBrandDetails),
      fetch({
        run: ({ payload }) => {
          return this.brandsDataService.getBrandDetails(payload).pipe(
            map((data) =>
              fromBrandsActions.getBrandDetailsSuccess({
                payload: { brandDetails: data },
              }),
            ),
          );
        },
        onError: (action, error: ApiError) => {
          return fromBrandsActions.getBrandDetailsFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  getBrandCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromBrandsActions.getBrandCategories),
      fetch({
        run: ({ payload }) => {
          return this.brandsDataService.getBrandCategories(payload).pipe(
            map((data) =>
              fromBrandsActions.getBrandCategoriesSuccess({
                payload: { data: data },
              }),
            ),
          );
        },
        onError: (action, error: ApiError) => {
          return fromBrandsActions.getBrandDetailsFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  getBrandSections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromBrandsActions.getBrandSections),
      fetch({
        run: () => {
          return this.brandsDataService.getBrandSection().pipe(
            map((payload) =>
              fromBrandsActions.getBrandSectionSuccess({
                payload,
              }),
            ),
          );
        },
        onError: (action, error: ApiError) => {
          return fromBrandsActions.getBrandSectionFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );
}
