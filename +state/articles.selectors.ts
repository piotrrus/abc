import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ARTICLES_FEATURE_KEY, ArticlesState } from './articles.reducer';

// Lookup the 'Articles' feature state managed by NgRx
const getArticlesState =
  createFeatureSelector<ArticlesState>(ARTICLES_FEATURE_KEY);

const getCurrentArticle = createSelector(
  getArticlesState,
  (state) => state.currentArticle
);

const getCurrentArticleError = createSelector(
  getArticlesState,
  (state) => state.currentArticleError
);

const getCurrentArticleLoading = createSelector(
  getArticlesState,
  (state) => state.currentArticleLoading
);

const getArticlesForNode = createSelector(
  getArticlesState,
  (state) => state.articlesForNode
);

const getArticlesForNodeError = createSelector(
  getArticlesState,
  (state) => state.articlesForNodeError
);

const getArticlesForNodeLoading = createSelector(
  getArticlesState,
  (state) => state.articlesForNodeLoading
);

const getArticlesForBrand = createSelector(
  getArticlesState,
  (state) => state.articlesForBrand
);

const getArticlesForBrandError = createSelector(
  getArticlesState,
  (state) => state.articlesForBrandError
);

const getArticlesForBrandLoading = createSelector(
  getArticlesState,
  (state) => state.articlesForBrandLoading
);

export const articlesQuery = {
  getCurrentArticle,
  getCurrentArticleError,
  getCurrentArticleLoading,
  getArticlesForNode,
  getArticlesForNodeError,
  getArticlesForNodeLoading,
  getArticlesForBrand,
  getArticlesForBrandError,
  getArticlesForBrandLoading,
};
