import {
  initialState,
  BRANDS_FEATURE_KEY,
  BrandsState,
} from './brands.reducer';
import { brandsQuery } from './brands.selectors';

describe('Brands Selectors', () => {
  let storeState: { [BRANDS_FEATURE_KEY]: BrandsState };

  beforeEach(() => {
    storeState = {
      [BRANDS_FEATURE_KEY]: initialState,
    };
  });

  describe('brandCategories', () => {
    test('getBrandCategories() returns brandCategories value', () => {
      const result = brandsQuery.getBrandCategories(storeState);

      expect(result).toBe(storeState[BRANDS_FEATURE_KEY].brandCategories);
    });
    test('getBrandCategoriesLoading() returns brandCategoriesLoading value', () => {
      const result = brandsQuery.getBrandCategoriesLoading(storeState);

      expect(result).toBe(
        storeState[BRANDS_FEATURE_KEY].brandCategoriesLoading
      );
    });
    test('getBrandCategoriesLoadError() returns brandCategoriesError value', () => {
      const result = brandsQuery.getBrandCategoriesLoadError(storeState);

      expect(result).toBe(storeState[BRANDS_FEATURE_KEY].brandCategoriesError);
    });
  });

  describe('brandDetails', () => {
    test('getBrandDetails() returns brandDetails value', () => {
      const result = brandsQuery.getBrandDetails(storeState);

      expect(result).toBe(storeState[BRANDS_FEATURE_KEY].brandDetails);
    });
    test('getBrandDetailsLoading() returns brandDetailsLoading value', () => {
      const result = brandsQuery.getBrandDetailsLoading(storeState);

      expect(result).toBe(storeState[BRANDS_FEATURE_KEY].brandDetailsLoading);
    });
    test('getBrandDetailsLoadError() returns brandDetailsError value', () => {
      const result = brandsQuery.getBrandDetailsLoadError(storeState);

      expect(result).toBe(storeState[BRANDS_FEATURE_KEY].brandDetailsError);
    });
  });

  describe('brandSections', () => {
    test('getBrandSections() returns brandSections value', () => {
      const result = brandsQuery.getBrandSections(storeState);

      expect(result).toBe(storeState[BRANDS_FEATURE_KEY].brandSections);
    });
  });
});
