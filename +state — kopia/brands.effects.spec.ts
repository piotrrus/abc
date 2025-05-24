import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BrandsEffects } from './brands.effects';
import { cold, hot } from 'jest-marbles';
import { fromBrandsActions } from './brands.actions';
import { BrandsDataService } from '@ems/euro-mobile/product/brands/infrastructure';
import { createSpyObj } from 'jest-createspyobj';
import { ProductDataService } from '@ems/euro-mobile/product/infrastructure';

describe('BrandsEffects', () => {
  let actions: Observable<any>;
  let effects: BrandsEffects;
  let brandsDataService: jest.Mocked<BrandsDataService>;
  let productDataService: jest.Mocked<ProductDataService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BrandsEffects,
        provideMockActions(() => actions),
        provideMockStore({ initialState: {} }),
        {
          provide: BrandsDataService,
          useValue: createSpyObj(BrandsDataService),
        },
        {
          provide: ProductDataService,
          useValue: createSpyObj(ProductDataService),
        },
      ],
    });

    effects = TestBed.inject(BrandsEffects);
    brandsDataService = TestBed.inject(
      BrandsDataService
    ) as jest.Mocked<BrandsDataService>;
    productDataService = TestBed.inject(
      ProductDataService
    ) as jest.Mocked<ProductDataService>;
  });

  describe('getBrandDetails$', () => {
    test('should dispatch getBrandDetailsSuccess on successful get call', () => {
      const action = fromBrandsActions.getBrandDetails({
        payload: {
          brandName: 'Samsung',
        },
      });
      const brandDetails = {} as never;
      const completion = fromBrandsActions.getBrandDetailsSuccess({
        payload: { brandDetails },
      });

      actions = hot('-a', { a: action });
      const expected = cold('-c', { c: completion });
      brandsDataService.getBrandDetails.mockReturnValue(of(brandDetails));

      expect(effects.getBrandDetails$).toBeObservable(expected);
    });
  });

  describe('getBrandCategories$', () => {
    test('should dispatch getBrandCategoriesSuccess on successful get call', () => {
      const action = fromBrandsActions.getBrandCategories({
        payload: {
          brandName: 'Samsung',
        },
      });
      const data = {} as never;
      const completion = fromBrandsActions.getBrandCategoriesSuccess({
        payload: { data: data },
      });

      actions = hot('-a', { a: action });
      const expected = cold('-c', { c: completion });
      brandsDataService.getBrandCategories.mockReturnValue(of(data));

      expect(effects.getBrandCategories$).toBeObservable(expected);
    });
  });

  describe('getBrandSections$', () => {
    test('should dispatch getBrandSectionSuccess on successful get call', () => {
      const action = fromBrandsActions.getBrandSections();
      const data = [] as never;
      const completion = fromBrandsActions.getBrandSectionSuccess({
        payload: [],
      });

      actions = hot('-a', { a: action });
      const expected = cold('-c', { c: completion });
      brandsDataService.getBrandSection.mockReturnValue(of(data));

      expect(effects.getBrandSections$).toBeObservable(expected);
    });
  });
});
