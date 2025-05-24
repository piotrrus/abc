import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createSpyObj } from 'jest-createspyobj';
import { ArticlesFacade } from './articles.facade';
import { ArticlesDataService } from '@ems/euro-mobile/articles/infrastructure';
import { fromArticlesActions } from './articles.actions';

describe('ArticlesFacade', () => {
  let facade: ArticlesFacade;
  let store: MockStore;

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [],
        providers: [ArticlesFacade, provideMockStore()],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [CustomFeatureModule],
        providers: [
          {
            provide: ArticlesDataService,
            useValue: {
              ...createSpyObj(ArticlesDataService),
            },
          },
        ],
      })
      class RootModule {}

      TestBed.configureTestingModule({ imports: [RootModule] });
      facade = TestBed.inject(ArticlesFacade);
      store = TestBed.inject(MockStore);
      jest.spyOn(store, 'dispatch');
    });

    describe('#getCurrentArticle', () => {
      test('should dispatch fromArticlesActions.getArticle action', () => {
        const articleLinkName = 'article-link-name';
        const action = fromArticlesActions.getArticle({
          payload: { articleLinkName },
        });

        facade.getCurrentArticle({ articleLinkName });
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#getArticlesForNode', () => {
      test('should dispatch fromArticlesActions.getArticlesForNode action', () => {
        const categoryLinkName = 'category-link-name';
        const action = fromArticlesActions.getArticlesForNode({
          payload: { categoryLinkName },
        });

        facade.getArticlesForNode({ categoryLinkName });
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe('#getArticlesForBrand', () => {
      test('should dispatch fromArticlesActions.getArticlesForBrand action', () => {
        const brandLinkName = 'brand-link-name';
        const action = fromArticlesActions.getArticlesForBrand({
          payload: { brandLinkName },
        });

        facade.getArticlesForBrand({ brandLinkName });
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });
  });
});
