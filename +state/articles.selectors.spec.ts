import {
  initialState,
  ARTICLES_FEATURE_KEY,
  ArticlesState,
} from './articles.reducer';
import { articlesQuery } from './articles.selectors';

describe('Articles Selectors', () => {
  let storeState: { [ARTICLES_FEATURE_KEY]: ArticlesState };

  beforeEach(() => {
    storeState = {
      [ARTICLES_FEATURE_KEY]: { ...initialState },
    };
  });

  test('getCurrentArticle() returns currentArticle value', () => {
    const result = articlesQuery.getCurrentArticle(storeState);
    expect(result).toBe(storeState[ARTICLES_FEATURE_KEY].currentArticle);
  });

  test('getCurrentArticleError() returns currentArticleError value', () => {
    const result = articlesQuery.getCurrentArticleError(storeState);
    expect(result).toBe(storeState[ARTICLES_FEATURE_KEY].currentArticleError);
  });

  test('getCurrentArticleLoading() returns getCurrentArticleLoading value', () => {
    const result = articlesQuery.getCurrentArticleLoading(storeState);
    expect(result).toBe(storeState[ARTICLES_FEATURE_KEY].currentArticleLoading);
  });

  test('getArticlesForNode() returns getArticlesForNode value', () => {
    const result = articlesQuery.getArticlesForNode(storeState);
    expect(result).toBe(storeState[ARTICLES_FEATURE_KEY].articlesForNode);
  });

  test('getArticlesForNodeError() returns articlesForNodeError value', () => {
    const result = articlesQuery.getArticlesForNodeError(storeState);
    expect(result).toBe(storeState[ARTICLES_FEATURE_KEY].articlesForNodeError);
  });

  test('getArticlesForNodeLoading() returns articlesForNodeLoading value', () => {
    const result = articlesQuery.getArticlesForNodeLoading(storeState);
    expect(result).toBe(
      storeState[ARTICLES_FEATURE_KEY].articlesForNodeLoading
    );
  });

  test('getArticlesForBrand() returns getArticlesForBrand value', () => {
    const result = articlesQuery.getArticlesForBrand(storeState);
    expect(result).toBe(storeState[ARTICLES_FEATURE_KEY].articlesForBrand);
  });

  test('getArticlesForBrandError() returns articlesForBrandError value', () => {
    const result = articlesQuery.getArticlesForBrandError(storeState);
    expect(result).toBe(storeState[ARTICLES_FEATURE_KEY].articlesForBrandError);
  });

  test('getArticlesForBrandLoading() returns articlesForBrandLoading value', () => {
    const result = articlesQuery.getArticlesForBrandLoading(storeState);
    expect(result).toBe(
      storeState[ARTICLES_FEATURE_KEY].articlesForBrandLoading
    );
  });
});
