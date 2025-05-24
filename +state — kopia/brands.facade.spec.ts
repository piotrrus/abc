import { NgModule, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProductFacade } from '@ems/euro-mobile/product/application';
import { BRANDS_FEATURE_KEY, initialState } from './brands.reducer';
import {
  GetBrandCategoriesPayload,
  GetBrandDataPayload,
} from '@ems/euro-mobile/product/brands/domain';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProviders } from 'ng-mocks';
import { Observable } from 'rxjs';
import { fromBrandsActions } from './brands.actions';
import { BrandsFacade } from './brands.facade';
describe('BrandsFacade', () => {
  let actions: Observable<any>;
  let facade: BrandsFacade;
  let store: MockStore;

  const setUpTestingModule = async (
    platformId: 'browser' | 'server' = 'browser'
  ) => {
    @NgModule({
      imports: [],
      providers: [
        BrandsFacade,
        provideMockStore({
          initialState: {
            [BRANDS_FEATURE_KEY]: {
              brandDetails: undefined,
            },
          },
        }),
        provideMockActions(() => actions),
        MockProviders(ProductFacade),
      ],
    })
    class CustomFeatureModule {}

    @NgModule({
      imports: [CustomFeatureModule],
      providers: [{ provide: PLATFORM_ID, useValue: platformId }],
    })
    class RootModule {}

    TestBed.configureTestingModule({ imports: [RootModule] });
    facade = TestBed.inject(BrandsFacade);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    jest.spyOn(store, 'select');
  };

  describe('used in NgModule', () => {
    describe('#getBrandDetails', () => {
      test('should dispatch fromBrandsActions.getBrandDetails action', async () => {
        await setUpTestingModule();

        const payload = {
          brandName: 'Samsung',
        } as GetBrandDataPayload;
        const action = fromBrandsActions.getBrandDetails({
          payload,
        });

        facade.getBrandDetails(payload);
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#brandDetails$', () => {
      test('should use brandDetails$ selector which return undefined', (done) => {
        setUpTestingModule();

        facade.brandDetails$.subscribe((data) => {
          expect(data).toBe(undefined);
          done();
        });
      });

      test('should use brandDetails$ selector which return value with empty products array', (done) => {
        setUpTestingModule();

        store.setState({
          [BRANDS_FEATURE_KEY]: {
            brandDetails: {
              mostVisitedCategories: [
                {
                  categoryProducts: [],
                },
              ],
            },
          },
        });
        store.refreshState();
        facade.brandDetails$.subscribe((data) => {
          expect(data.mostVisitedCategories.length).toBe(1);
          expect(data.mostVisitedCategories[0].categoryProducts.length).toBe(0);
          done();
        });
      });

      test('should use brandDetails$ selector which return value with products array with one element', (done) => {
        setUpTestingModule();

        store.setState({
          [BRANDS_FEATURE_KEY]: {
            brandDetails: {
              mostVisitedCategories: [
                {
                  categoryProducts: [{ linkName: 'linkName' }],
                },
              ],
            },
          },
        });
        store.refreshState();
        facade.brandDetails$.subscribe((data) => {
          expect(data.mostVisitedCategories.length).toBe(1);
          expect(data.mostVisitedCategories[0].categoryProducts.length).toBe(1);
          done();
        });
      });
    });

    describe('#getBrandCategories', () => {
      test('should dispatch fromBrandsActions.getBrandCategories action', async () => {
        await setUpTestingModule();

        const payload = {
          brandName: 'Samsung',
        } as GetBrandCategoriesPayload;
        const action = fromBrandsActions.getBrandCategories({
          payload,
        });

        facade.getBrandCategories(payload);
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#showBrandSecion$', () => {
      test('should return false for undefined value of opportunityZoneSmallBanners', (done) => {
        setUpTestingModule();

        store.setState({
          [BRANDS_FEATURE_KEY]: {
            ...initialState,
            brandSections: undefined,
          },
        });
        store.refreshState();
        facade.showBrandSecion$().subscribe((show: boolean) => {
          expect(show).toBeFalsy();
          done();
        });
      });
      test('should return true when brandSections have one section', (done) => {
        setUpTestingModule();

        store.setState({
          [BRANDS_FEATURE_KEY]: {
            ...initialState,
            brandSections: [{ abc: 'abc' }],
          },
        });
        store.refreshState();
        facade.showBrandSecion$().subscribe((show: boolean) => {
          expect(show).toBeTruthy();
          done();
        });
      });
      test('should return false when brandSections are empty', (done) => {
        setUpTestingModule();

        store.setState({
          [BRANDS_FEATURE_KEY]: {
            ...initialState,
            brandSections: [],
          },
        });
        store.refreshState();
        facade.showBrandSecion$().subscribe((show: boolean) => {
          expect(show).toBeFalsy();
          done();
        });
      });
    });

    describe('getBrandSections', () => {
      test('should dispatch fromBrandsActions.getBrandSections action', async () => {
        await setUpTestingModule();

        const action = fromBrandsActions.getBrandSections();

        facade.getBrandSections();
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('getBrandSections on SSR', () => {
      test('should dispatch fromBrandsActions.getBrandSections action', async () => {
        await setUpTestingModule('server');

        const action = fromBrandsActions.getBrandSections();

        facade.getBrandSections();
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });
  });
});
