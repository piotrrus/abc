import {
  GetArticlesForBrandSuccessPayload,
  GetArticlesForNodeSuccessPayload,
  GetArticleSuccessPayload,
} from '@ems/euro-mobile/articles/domain';
import { ApiError } from '@ems/shared/domain';
import { createReducer, on } from '@ngrx/store';
import { fromArticlesActions } from './articles.actions';

export const ARTICLES_FEATURE_KEY = 'articles';

export interface ArticlesState {
  currentArticle: GetArticleSuccessPayload | null;
  currentArticleError: ApiError | null;
  currentArticleLoading: boolean;
  articlesForNode: GetArticlesForNodeSuccessPayload | null;
  articlesForNodeError: ApiError | null;
  articlesForNodeLoading: boolean;
  articlesForBrand: GetArticlesForBrandSuccessPayload;
  articlesForBrandError: ApiError | null;
  articlesForBrandLoading: boolean;
}

export interface ArticlesPartialState {
  readonly [ARTICLES_FEATURE_KEY]: ArticlesState;
}

export const initialState: ArticlesState = {
  currentArticle: null,
  currentArticleError: null,
  currentArticleLoading: false,
  articlesForNode: [],
  articlesForNodeError: null,
  articlesForNodeLoading: false,
  articlesForBrand: [],
  articlesForBrandError: null,
  articlesForBrandLoading: false,
};

export const articlesReducer = createReducer(
  initialState,
  on(fromArticlesActions.getArticle, (state) => ({
    ...state,
    currentArticle: null,
    currentArticleLoading: true,
    currentArticleError: null,
  })),
  on(fromArticlesActions.getArticleSuccess, (state, { payload }) => ({
    ...state,
    currentArticle: payload,
    currentArticleLoading: false,
    currentArticleError: null,
  })),
  on(fromArticlesActions.getArticleFail, (state, { payload }) => ({
    ...state,
    currentArticle: null,
    currentArticleLoading: false,
    currentArticleError: payload.error,
  })),
  on(fromArticlesActions.getArticlesForNode, (state) => ({
    ...state,
    articlesForNode: [],
    articlesForNodeLoading: true,
    articlesForNodeError: null,
  })),
  on(fromArticlesActions.getArticlesForNodeSuccess, (state, { payload }) => ({
    ...state,
    articlesForNode: payload,
    articlesForNodeLoading: false,
    articlesForNodeError: null,
  })),
  on(fromArticlesActions.getArticlesForNodeFail, (state, { payload }) => ({
    ...state,
    articlesForNode: [],
    articlesForNodeLoading: false,
    articlesForNodeError: payload.error,
  })),
  on(fromArticlesActions.getArticlesForBrand, (state) => ({
    ...state,
    articlesForBrand: [],
    articlesForBrandLoading: true,
    articlesForBrandError: null,
  })),
  on(fromArticlesActions.getArticlesForBrandSuccess, (state, { payload }) => ({
    ...state,
    articlesForBrand: payload ?? [],
    articlesForBrandLoading: false,
    articlesForBrandError: null,
  })),
  on(fromArticlesActions.getArticlesForBrandFail, (state, { payload }) => ({
    ...state,
    articlesForBrand: [],
    articlesForBrandLoading: false,
    articlesForBrandError: payload.error,
  }))
);
