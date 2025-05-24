import {
  articlesReducer,
  ArticlesState,
  initialState,
} from './articles.reducer';
import { statesEqual } from '@valueadd/testing';
import { ApiError, HttpStatusCode } from '@ems/shared/domain';
import { fromArticlesActions } from './articles.actions';
import {
  GetArticlesForBrandSuccessPayload,
  GetArticlesForNodeSuccessPayload,
  GetArticleSuccessPayload,
} from '@ems/euro-mobile/articles/domain';

describe('Articles Reducer', () => {
  let state: ArticlesState;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('unknown action', () => {
    test('returns the initial state', () => {
      const action = {} as never;
      const result = articlesReducer(state, action);

      expect(result).toBe(state);
    });
  });

  describe('getArticle', () => {
    test('should set currentArticle, currentArticleError, currentArticleLoading and not modify other properties', () => {
      const action = fromArticlesActions.getArticle({
        payload: { articleLinkName: 'article-link-name' },
      });
      const result = articlesReducer(state, action);

      expect(result.currentArticle).toBe(null);
      expect(result.currentArticleError).toBe(null);
      expect(result.currentArticleLoading).toBeTruthy();
      expect(
        statesEqual(result, state, [
          'currentArticle',
          'currentArticleError',
          'currentArticleLoading',
        ])
      ).toBeTruthy();
    });
  });

  describe('getArticleSuccess', () => {
    test('should set currentArticle, currentArticleError, currentArticleLoading and not modify other properties', () => {
      const payload = { name: 'article-name' } as GetArticleSuccessPayload;
      const action = fromArticlesActions.getArticleSuccess({
        payload,
      });
      const result = articlesReducer(state, action);

      expect(result.currentArticle).toBe(payload);
      expect(result.currentArticleError).toBe(null);
      expect(result.currentArticleLoading).toBeFalsy();
      expect(
        statesEqual(result, state, [
          'currentArticle',
          'currentArticleError',
          'currentArticleLoading',
        ])
      ).toBeTruthy();
    });
  });

  describe('getArticleFail', () => {
    test('should set currentArticle, currentArticleError, currentArticleLoading and not modify other properties', () => {
      const error = { status: HttpStatusCode.BAD_REQUEST } as ApiError;
      const action = fromArticlesActions.getArticleFail({
        payload: { error },
      });
      const result = articlesReducer(state, action);

      expect(result.currentArticle).toBe(null);
      expect(result.currentArticleError).toBe(error);
      expect(result.currentArticleLoading).toBeFalsy();
      expect(
        statesEqual(result, state, [
          'currentArticle',
          'currentArticleError',
          'currentArticleLoading',
        ])
      ).toBeTruthy();
    });
  });

  describe('getArticlesForNode', () => {
    test('should set articlesForNode, articlesForNodeError, articlesForNodeLoading and not modify other properties', () => {
      const action = fromArticlesActions.getArticlesForNode({
        payload: { categoryLinkName: 'category-link-name' },
      });
      const result = articlesReducer(state, action);

      expect(result.articlesForNode).toEqual([]);
      expect(result.articlesForNodeError).toBe(null);
      expect(result.articlesForNodeLoading).toBeTruthy();
      expect(
        statesEqual(result, state, [
          'articlesForNode',
          'articlesForNodeError',
          'articlesForNodeLoading',
        ])
      ).toBeTruthy();
    });
  });

  describe('getArticlesForNodeSuccess', () => {
    test('should set articlesForNode, articlesForNodeError, articlesForNodeLoading and not modify other properties', () => {
      const payload = [
        { name: 'article-name' },
      ] as GetArticlesForNodeSuccessPayload;
      const action = fromArticlesActions.getArticlesForNodeSuccess({
        payload,
      });
      const result = articlesReducer(state, action);

      expect(result.articlesForNode).toBe(payload);
      expect(result.articlesForNodeError).toBe(null);
      expect(result.articlesForNodeLoading).toBeFalsy();
      expect(
        statesEqual(result, state, [
          'articlesForNode',
          'articlesForNodeError',
          'articlesForNodeLoading',
        ])
      ).toBeTruthy();
    });
  });

  describe('getArticlesForNodeFail', () => {
    test('should set articlesForNode, articlesForNodeError, articlesForNodeLoading and not modify other properties', () => {
      const error = { status: HttpStatusCode.BAD_REQUEST } as ApiError;
      const action = fromArticlesActions.getArticlesForNodeFail({
        payload: { error },
      });
      const result = articlesReducer(state, action);

      expect(result.articlesForNode).toEqual([]);
      expect(result.articlesForNodeError).toBe(error);
      expect(result.articlesForNodeLoading).toBeFalsy();
      expect(
        statesEqual(result, state, [
          'articlesForNode',
          'articlesForNodeError',
          'articlesForNodeLoading',
        ])
      ).toBeTruthy();
    });
  });

  describe('getArticlesForBrand', () => {
    test('should set articlesForBrand, articlesForBrandError, articlesForBrandLoading and not modify other properties', () => {
      const action = fromArticlesActions.getArticlesForBrand({
        payload: { brandLinkName: 'brand-link-name' },
      });
      const result = articlesReducer(state, action);

      expect(result.articlesForBrand).toEqual([]);
      expect(result.articlesForBrandError).toBe(null);
      expect(result.articlesForBrandLoading).toBeTruthy();
      expect(
        statesEqual(result, state, [
          'articlesForBrand',
          'articlesForBrandError',
          'articlesForBrandLoading',
        ])
      ).toBeTruthy();
    });
  });

  describe('getArticlesForBrandSuccess', () => {
    test('should set articlesForBrand, articlesForBrandError, articlesForBrandLoading and not modify other properties', () => {
      const payload = [
        { name: 'article-name' },
      ] as GetArticlesForBrandSuccessPayload;
      const action = fromArticlesActions.getArticlesForBrandSuccess({
        payload,
      });
      const result = articlesReducer(state, action);

      expect(result.articlesForBrand).toBe(payload);
      expect(result.articlesForBrandError).toBe(null);
      expect(result.articlesForBrandLoading).toBeFalsy();
      expect(
        statesEqual(result, state, [
          'articlesForBrand',
          'articlesForBrandError',
          'articlesForBrandLoading',
        ])
      ).toBeTruthy();
    });
  });

  describe('getArticlesForBrandFail', () => {
    test('should set articlesForBrand, articlesForBrandError, articlesForBrandLoading and not modify other properties', () => {
      const error = { status: HttpStatusCode.BAD_REQUEST } as ApiError;
      const action = fromArticlesActions.getArticlesForBrandFail({
        payload: { error },
      });
      const result = articlesReducer(state, action);

      expect(result.articlesForBrand).toEqual([]);
      expect(result.articlesForBrandError).toBe(error);
      expect(result.articlesForBrandLoading).toBeFalsy();
      expect(
        statesEqual(result, state, [
          'articlesForBrand',
          'articlesForBrandError',
          'articlesForBrandLoading',
        ])
      ).toBeTruthy();
    });
  });
});
