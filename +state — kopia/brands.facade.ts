import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BrandsPartialState } from './brands.reducer';
import {
  GetBrandCategoriesPayload,
  GetBrandDataPayload,
} from '@ems/euro-mobile/product/brands/domain';
import { fromBrandsActions } from './brands.actions';
import { brandsQuery } from './brands.selectors';
import { filter, finalize, first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BrandsFacade {
  readonly brandDetails$ = this.store.pipe(select(brandsQuery.getBrandDetails));
  readonly brandDetailsLoading$ = this.store.pipe(
    select(brandsQuery.getBrandDetailsLoading),
  );
  readonly brandDetailsLoadError$ = this.store.pipe(
    select(brandsQuery.getBrandDetailsLoadError),
  );

  readonly brandCategories$ = this.store.pipe(
    select(brandsQuery.getBrandCategories),
  );
  readonly brandCategoriesLoading$ = this.store.pipe(
    select(brandsQuery.getBrandCategoriesLoading),
  );
  readonly brandCategoriesLoadError$ = this.store.pipe(
    select(brandsQuery.getBrandCategoriesLoadError),
  );

  readonly brandSections$ = this.store.pipe(
    select(brandsQuery.getBrandSections),
  );
  readonly getBrandSectionsInit$ = this.store.pipe(
    select(brandsQuery.getBrandSectionsInit),
  );

  readonly brandSectionsLoading$ = this.store.pipe(
    select(brandsQuery.getBrandSectionsLoading),
  );

  constructor(
    private readonly store: Store<BrandsPartialState>,
    @Inject(PLATFORM_ID) private readonly platformId: Record<string, unknown>,
  ) {}

  getBrandDetails(payload: GetBrandDataPayload): void {
    this.store.dispatch(
      fromBrandsActions.getBrandDetails({
        payload,
      }),
    );
  }

  getBrandCategories(payload: GetBrandCategoriesPayload): void {
    this.store.dispatch(
      fromBrandsActions.getBrandCategories({
        payload,
      }),
    );
  }

  getBrandSections(): void {
    if (isPlatformServer(this.platformId)) {
      this.store.dispatch(fromBrandsActions.getBrandSections());
      return;
    }

    this.getBrandSectionsInit$
      .pipe(
        filter((isInitialized) => !isInitialized),
        first(),
        finalize(() => {
          this.store.dispatch(fromBrandsActions.getBrandSections());
        }),
      )
      .subscribe();
  }

  showBrandSecion$(): Observable<boolean> {
    return this.brandSections$.pipe(map((response) => response?.length > 0));
  }
}
