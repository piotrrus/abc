import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BRANDS_FEATURE_KEY, BrandsState } from './brands.reducer';

// Lookup the 'Brands' feature state managed by NgRx
const getBrandsState = createFeatureSelector<BrandsState>(BRANDS_FEATURE_KEY);

const getBrandDetails = createSelector(
  getBrandsState,
  (state) => state.brandDetails
);

const getBrandDetailsLoading = createSelector(
  getBrandsState,
  (state) => state.brandDetailsLoading
);

const getBrandDetailsLoadError = createSelector(
  getBrandsState,
  (state) => state.brandDetailsError
);

const getBrandCategories = createSelector(
  getBrandsState,
  (state) => state.brandCategories
);

const getBrandCategoriesLoading = createSelector(
  getBrandsState,
  (state) => state.brandCategoriesLoading
);

const getBrandCategoriesLoadError = createSelector(
  getBrandsState,
  (state) => state.brandCategoriesError
);

const getBrandSections = createSelector(
  getBrandsState,
  (state) => state.brandSections
);

const getBrandSectionsLoading = createSelector(
  getBrandsState,
  (state) => state.brandSectionsLoading
);

const getBrandSectionsInit = createSelector(
  getBrandsState,
  (state) => state.brandSectionsInit
);

export const brandsQuery = {
  getBrandDetails,
  getBrandDetailsLoading,
  getBrandDetailsLoadError,
  getBrandCategories,
  getBrandCategoriesLoading,
  getBrandCategoriesLoadError,
  getBrandSections,
  getBrandSectionsInit,
  getBrandSectionsLoading,
};
