import { createReducer, on } from '@ngrx/store';
import {
  BrandCategories,
  BrandDetails,
  GetBrandSectionSuccessPayload,
} from '@ems/euro-mobile/product/brands/domain';
import { ApiError } from '@ems/shared/domain';
import { fromBrandsActions } from './brands.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from '@ems/euro-mobile/product/domain';

export const BRANDS_FEATURE_KEY = 'brands';

export type BrandProductEntityState = EntityState<Product>;

export interface BrandsState {
  brandDetails: BrandDetails | null;
  brandDetailsLoading: boolean;
  brandDetailsError: ApiError | null;
  brandCategories: BrandCategories | null;
  brandCategoriesLoading: boolean;
  brandCategoriesError: ApiError | null;
  brandSections: GetBrandSectionSuccessPayload;
  brandSectionsLoading: boolean;
  brandSectionsError: ApiError | null;
  brandSectionsInit: boolean;
}

export interface BrandsPartialState {
  readonly [BRANDS_FEATURE_KEY]: BrandsState;
}

export const brandProductAdapter: EntityAdapter<Product> =
  createEntityAdapter<Product>({
    selectId: (product) => product.identifiers.plu,
  });

export const initialState: BrandsState = {
  brandDetails: null,
  brandDetailsError: null,
  brandDetailsLoading: false,
  brandCategories: null,
  brandCategoriesLoading: false,
  brandCategoriesError: null,
  brandSections: [],
  brandSectionsLoading: false,
  brandSectionsError: null,
  brandSectionsInit: false,
};

export const brandsReducer = createReducer(
  initialState,
  on(fromBrandsActions.getBrandDetails, (state) => ({
    ...state,
    brandDetails: null,
    brandDetailsLoading: true,
    brandDetailsError: null,
  })),
  on(fromBrandsActions.getBrandDetailsSuccess, (state, { payload }) => ({
    ...state,
    brandDetails: payload.brandDetails,
    brandDetailsLoading: false,
    brandDetailsError: null,
  })),
  on(fromBrandsActions.getBrandDetailsFail, (state, { payload }) => ({
    ...state,
    brandDetails: null,
    brandDetailsLoading: false,
    brandDetailsError: payload.error,
  })),
  on(fromBrandsActions.getBrandCategories, (state) => ({
    ...state,
    brandCategories: null,
    brandCategoriesLoading: true,
    brandCategoriesError: null,
  })),
  on(fromBrandsActions.getBrandCategoriesSuccess, (state, { payload }) => ({
    ...state,
    brandCategories: payload.data,
    brandCategoriesLoading: false,
    brandCategoriesError: null,
  })),
  on(fromBrandsActions.getBrandCategoriesFail, (state, { payload }) => ({
    ...state,
    brandCategories: null,
    brandCategoriesLoading: false,
    brandCategoriesError: payload.error,
  })),
  on(fromBrandsActions.getBrandSections, (state) => ({
    ...state,
    brandSections: [],
    brandSectionsLoading: true,
    brandSectionsError: null,
  })),
  on(fromBrandsActions.getBrandSectionSuccess, (state, { payload }) => ({
    ...state,
    brandSections: payload,
    brandSectionsLoading: false,
    brandSectionsError: null,
    brandSectionsInit: true,
  })),
  on(fromBrandsActions.getBrandSectionFail, (state, { payload }) => ({
    ...state,
    brandSections: [],
    brandSectionsLoading: false,
    brandSectionsError: payload.error,
    brandSectionsInit: true,
  }))
);
