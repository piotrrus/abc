import { TestBed } from '@angular/core/testing';
import {
  ArticleMiniature,
  GetArticleFailPayload,
  GetArticlePayload,
  GetArticlesForBrandFailPayload,
  GetArticlesForBrandPayload,
  GetArticlesForNodeFailPayload,
  GetArticlesForNodePayload,
  GetArticleSuccessPayload,
} from '@ems/euro-mobile/articles/domain';
import { ArticlesDataService } from '@ems/euro-mobile/articles/infrastructure';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { createSpyObj } from 'jest-createspyobj';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';
import { fromArticlesActions } from './articles.actions';
import { ArticlesEffects } from './articles.effects';
import { ApiError } from '@ems/shared/domain';

describe('ArticlesEffects', () => {
  let actions: Observable<any>;
  let effects: ArticlesEffects;
  let articlesDataService: jest.Mocked<ArticlesDataService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArticlesEffects,
        {
          provide: ArticlesDataService,
          useValue: createSpyObj(ArticlesDataService),
        },
        provideMockActions(() => actions),
        provideMockStore({ initialState: {} }),
      ],
    });

    effects = TestBed.inject(ArticlesEffects);
    articlesDataService = TestBed.inject(
      ArticlesDataService
    ) as jest.Mocked<ArticlesDataService>;
  });

  it('should create', () => {
    expect(effects).toBeTruthy();
  });

  describe('getCurrentArticle$', () => {
    const payload: GetArticlePayload = {
      articleLinkName: 'name',
    };

    test('should return getArticleSuccess action on success', () => {
      const article = {
        rankingProducts: [{ plu: '123' }, { plu: '1234' }],
      } as GetArticleSuccessPayload;

      const action = fromArticlesActions.getArticle({ payload });
      const completion = fromArticlesActions.getArticleSuccess({
        payload: article,
      });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: article });
      const expected = cold('---c', { c: completion });
      articlesDataService.getArticle.mockReturnValue(response);

      expect(effects.getCurrentArticle$).toSatisfyOnFlush(() => {
        expect(articlesDataService.getArticle).toHaveBeenCalled();
      });
      expect(effects.getCurrentArticle$).toBeObservable(expected);
    });

    test('should return getArticleFail action on fail', () => {
      const getArticleFailPayload: GetArticleFailPayload = {
        error: {} as ApiError,
      };
      const action = fromArticlesActions.getArticle({ payload });
      const completion = fromArticlesActions.getArticleFail({
        payload: getArticleFailPayload,
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });
      articlesDataService.getArticle.mockReturnValue(response);

      expect(effects.getCurrentArticle$).toSatisfyOnFlush(() => {
        expect(articlesDataService.getArticle).toHaveBeenCalled();
      });
      expect(effects.getCurrentArticle$).toBeObservable(expected);
    });
  });

  describe('getArticlesForNode$', () => {
    const getArticlesForNodePayload: GetArticlesForNodePayload = {
      categoryLinkName: 'test',
    };

    test('should successfully get customer account details and return getCustomerAccountDetailsSuccess', () => {
      const result: ArticleMiniature[] = [
        {
          name: 'article',
          photoUrl: 'photo',
          link: 'link',
          thumbsUp: 2,
          thumbsDown: 4,
        },
      ];

      const action = fromArticlesActions.getArticlesForNode({
        payload: getArticlesForNodePayload,
      });
      const completion = fromArticlesActions.getArticlesForNodeSuccess({
        payload: result,
      });

      actions = hot('-a', { a: action });
      const response = cold('--b', { b: result });
      const expected = cold('---c', { c: completion });

      articlesDataService.getArticlesForNode.mockReturnValue(response);

      expect(effects.getArticlesForNode$).toSatisfyOnFlush(() => {
        expect(articlesDataService.getArticlesForNode).toHaveBeenCalled();
      });
      expect(effects.getArticlesForNode$).toBeObservable(expected);
    });

    test('should fail get customer account details and return getArticlesForNodeFail', () => {
      const getArticlesForNodeFailPayload: GetArticlesForNodeFailPayload = {
        error: {} as ApiError,
      };
      const action = fromArticlesActions.getArticlesForNode({
        payload: getArticlesForNodePayload,
      });
      const completion = fromArticlesActions.getArticlesForNodeFail({
        payload: getArticlesForNodeFailPayload,
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });

      articlesDataService.getArticlesForNode.mockReturnValue(response);

      expect(effects.getArticlesForNode$).toSatisfyOnFlush(() => {
        expect(articlesDataService.getArticlesForNode).toHaveBeenCalled();
      });
      expect(effects.getArticlesForNode$).toBeObservable(expected);
    });
  });

  describe('getArticlesForBrand$', () => {
    const getArticlesForBrandPayload: GetArticlesForBrandPayload = {
      brandLinkName: 'test',
    };

    test('should successfully get articles for brand and return getArticlesForBrandSuccess', () => {
      const result: ArticleMiniature[] = [
        {
          name: 'article',
          photoUrl: 'photo',
          link: 'link',
        } as ArticleMiniature,
      ];

      const action = fromArticlesActions.getArticlesForBrand({
        payload: getArticlesForBrandPayload,
      });
      const completion = fromArticlesActions.getArticlesForBrandSuccess({
        payload: result,
      });

      actions = hot('-a', { a: action });
      const response = cold('--b', { b: result });
      const expected = cold('---c', { c: completion });

      articlesDataService.getArticlesForBrand.mockReturnValue(response);

      expect(effects.getArticlesForBrand$).toSatisfyOnFlush(() => {
        expect(articlesDataService.getArticlesForBrand).toHaveBeenCalled();
      });
      expect(effects.getArticlesForBrand$).toBeObservable(expected);
    });

    test('should fail get articles for brand and return getArticlesForBrandFail', () => {
      const getArticlesForBrandFailPayload: GetArticlesForBrandFailPayload = {
        error: {} as ApiError,
      };
      const action = fromArticlesActions.getArticlesForBrand({
        payload: getArticlesForBrandPayload,
      });
      const completion = fromArticlesActions.getArticlesForBrandFail({
        payload: getArticlesForBrandFailPayload,
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });

      articlesDataService.getArticlesForBrand.mockReturnValue(response);

      expect(effects.getArticlesForBrand$).toSatisfyOnFlush(() => {
        expect(articlesDataService.getArticlesForBrand).toHaveBeenCalled();
      });
      expect(effects.getArticlesForBrand$).toBeObservable(expected);
    });
  });
});
