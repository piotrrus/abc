import {
  GetBrandCategoriesFailPayload,
  GetBrandCategoriesPayload,
  GetBrandCategoriesSuccessPayload,
  GetBrandDataPayload,
  GetBrandDataSuccessPayload,
  GetBrandsDataFailPayload,
  GetBrandSectionFailPayload,
  GetBrandSectionSuccessPayload,
} from '@ems/euro-mobile/product/brands/domain';
import { ActionPayload } from '@ems/shared/domain';
import { createAction, props } from '@ngrx/store';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace fromBrandsActions {
  export enum Types {
    GetBrandsData = '[Brands] Get Brand Details',
    GetBrandsDataSuccess = '[Brands] Get Brand Success',
    GetBrandsDataFail = '[Brands] Get Brand Fail',
    GetBrandsCategories = '[Brands] Get Brand Categories',
    GetBrandsCategoriesSuccess = '[Brands] Get Brand Categories Success',
    GetBrandsCategoriesFail = '[Brands] Get Brand Categories Fail',
    GetBrandSections = '[Brands] Get Brand Sections',
    GetBrandSectionsSuccess = '[Brands] Get Brand Sections Success',
    GetBrandSectionsFail = '[Brands] Get Brand Sections Fail',
  }

  export const getBrandDetails = createAction(
    Types.GetBrandsData,
    props<ActionPayload<GetBrandDataPayload>>()
  );

  export const getBrandDetailsSuccess = createAction(
    Types.GetBrandsDataSuccess,
    props<ActionPayload<GetBrandDataSuccessPayload>>()
  );

  export const getBrandDetailsFail = createAction(
    Types.GetBrandsDataFail,
    props<ActionPayload<GetBrandsDataFailPayload>>()
  );

  export const getBrandCategories = createAction(
    Types.GetBrandsCategories,
    props<ActionPayload<GetBrandCategoriesPayload>>()
  );

  export const getBrandCategoriesSuccess = createAction(
    Types.GetBrandsCategoriesSuccess,
    props<ActionPayload<GetBrandCategoriesSuccessPayload>>()
  );

  export const getBrandCategoriesFail = createAction(
    Types.GetBrandsCategoriesFail,
    props<ActionPayload<GetBrandCategoriesFailPayload>>()
  );

  export const getBrandSections = createAction(Types.GetBrandSections);

  export const getBrandSectionSuccess = createAction(
    Types.GetBrandSectionsSuccess,
    props<ActionPayload<GetBrandSectionSuccessPayload>>()
  );

  export const getBrandSectionFail = createAction(
    Types.GetBrandSectionsFail,
    props<ActionPayload<GetBrandSectionFailPayload>>()
  );
}
