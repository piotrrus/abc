import { statesEqual } from '@valueadd/testing';
import { fromBrandsActions } from './brands.actions';
import { brandsReducer, BrandsState, initialState } from './brands.reducer';

describe('Brands Reducer', () => {
  let state: BrandsState;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('unknown action', () => {
    test('returns the initial state', () => {
      const action = {} as any;
      const result = brandsReducer(state, action);

      expect(result).toBe(state);
    });
  });

  describe('getBrandDetails', () => {
    test('sets brandDetails, brandDetailsLoading, brandDetailsError and does not modify other state properties', () => {
      const payload = {} as never;
      const action = fromBrandsActions.getBrandDetails(payload);
      const result = brandsReducer(state, action);

      expect(result.brandDetails).toEqual(null);
      expect(result.brandDetailsLoading).toEqual(true);
      expect(result.brandDetailsError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'brandDetails',
          'brandDetailsLoading',
          'brandDetailsError',
        ])
      ).toBeTruthy();
    });
  });

  describe('getBrandDetailsFail', () => {
    test('sets brandDetails, brandDetailsLoading, brandDetailsError and does not modify other state properties', () => {
      const payload = {
        error: '',
      } as any;
      const action = fromBrandsActions.getBrandDetailsFail({ payload });
      const result = brandsReducer(state, action);

      expect(result.brandDetails).toEqual(null);
      expect(result.brandDetailsLoading).toEqual(false);
      expect(result.brandDetailsError).toEqual(payload.error);
      expect(
        statesEqual(result, state, [
          'brandDetails',
          'brandDetailsLoading',
          'brandDetailsError',
        ])
      ).toBeTruthy();
    });
  });

  describe('getBrandDetailsSuccess', () => {
    test('sets brandDetails, brandDetailsLoading, brandDetailsError and does not modify other state properties', () => {
      const brandDetails = {} as never;
      const action = fromBrandsActions.getBrandDetailsSuccess({
        payload: {
          brandDetails,
        },
      });
      const result = brandsReducer(state, action);

      expect(result.brandDetails).toEqual(brandDetails);
      expect(result.brandDetailsLoading).toEqual(false);
      expect(result.brandDetailsError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'brandDetails',
          'brandDetailsLoading',
          'brandDetailsError',
        ])
      ).toBeTruthy();
    });
  });

  describe('getBrandCategories', () => {
    test('sets brandCategories, brandCategoriesLoading, brandCategoriesError and does not modify other state properties', () => {
      const payload = {} as never;
      const action = fromBrandsActions.getBrandCategories(payload);
      const result = brandsReducer(state, action);

      expect(result.brandCategories).toEqual(null);
      expect(result.brandCategoriesLoading).toEqual(true);
      expect(result.brandCategoriesError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'brandCategories',
          'brandCategoriesLoading',
          'brandCategoriesError',
        ])
      ).toBeTruthy();
    });
  });

  describe('getBrandCategoriesFail', () => {
    test('sets brandCategories, brandCategoriesLoading, brandCategoriesError and does not modify other state properties', () => {
      const payload = {
        error: '',
      } as any;
      const action = fromBrandsActions.getBrandCategoriesFail({ payload });
      const result = brandsReducer(state, action);

      expect(result.brandCategories).toEqual(null);
      expect(result.brandCategoriesLoading).toEqual(false);
      expect(result.brandCategoriesError).toEqual(payload.error);
      expect(
        statesEqual(result, state, [
          'brandCategories',
          'brandCategoriesLoading',
          'brandCategoriesError',
        ])
      ).toBeTruthy();
    });
  });

  describe('getBrandCategoriesSuccess', () => {
    test('sets brandCategories, brandCategoriesLoading, brandCategoriesError and does not modify other state properties', () => {
      const payload = {
        data: {},
      } as never;
      const action = fromBrandsActions.getBrandCategoriesSuccess({
        payload,
      });
      const result = brandsReducer(state, action);

      expect(result.brandCategories).toEqual({});
      expect(result.brandCategoriesLoading).toEqual(false);
      expect(result.brandCategoriesError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'brandCategories',
          'brandCategoriesLoading',
          'brandCategoriesError',
        ])
      ).toBeTruthy();
    });
  });

  describe('getBrandSections', () => {
    test('sets brandSections, brandSectionsLoading, brandSectionsError and does not modify other state properties', () => {
      const action = fromBrandsActions.getBrandSections();
      const result = brandsReducer(state, action);

      expect(result.brandSections).toEqual([]);
      expect(result.brandSectionsLoading).toEqual(true);
      expect(result.brandSectionsError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'brandSections',
          'brandSectionsLoading',
          'brandSectionsError',
        ])
      ).toBeTruthy();
    });
  });

  describe('getBrandSectionFail', () => {
    test('sets brandSections, brandSectionsLoading, brandSectionsError and does not modify other state properties', () => {
      const payload = {
        error: '',
      } as any;
      const action = fromBrandsActions.getBrandSectionFail({ payload });
      const result = brandsReducer(state, action);

      expect(result.brandSections).toEqual([]);
      expect(result.brandSectionsLoading).toEqual(false);
      expect(result.brandSectionsError).toEqual(payload.error);
      expect(
        statesEqual(result, state, [
          'brandSections',
          'brandSectionsLoading',
          'brandSectionsError',
          'brandSectionsInit',
        ])
      ).toBeTruthy();
    });
  });

  describe('getBrandSectionSuccess', () => {
    test('sets brandSections, brandSectionsLoading, brandSectionsError and does not modify other state properties', () => {
      const payload = [] as never;
      const action = fromBrandsActions.getBrandSectionSuccess({
        payload,
      });
      const result = brandsReducer(state, action);

      expect(result.brandSections).toEqual([]);
      expect(result.brandSectionsLoading).toEqual(false);
      expect(result.brandSectionsError).toEqual(null);
      expect(
        statesEqual(result, state, [
          'brandSections',
          'brandSectionsLoading',
          'brandSectionsError',
          'brandSectionsInit',
        ])
      ).toBeTruthy();
    });
  });
});
