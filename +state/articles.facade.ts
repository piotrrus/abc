import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ArticlesPartialState } from './articles.reducer';
import { articlesQuery } from './articles.selectors';
import { fromArticlesActions } from './articles.actions';
import {
  GetArticlePayload,
  GetArticlesForBrandPayload,
  GetArticlesForNodePayload,
} from '@ems/euro-mobile/articles/domain';

@Injectable({ providedIn: 'root' })
export class ArticlesFacade {
  readonly currentArticle$ = this.store.pipe(
    select(articlesQuery.getCurrentArticle)
  );
  readonly currentArticleLoading$ = this.store.pipe(
    select(articlesQuery.getCurrentArticleLoading)
  );
  readonly currentArticleError$ = this.store.pipe(
    select(articlesQuery.getCurrentArticleError)
  );

  readonly articlesForNode$ = this.store.pipe(
    select(articlesQuery.getArticlesForNode)
  );

  readonly articlesForNodeLoading$ = this.store.pipe(
    select(articlesQuery.getArticlesForNodeLoading)
  );

  readonly articlesForBrand$ = this.store.pipe(
    select(articlesQuery.getArticlesForBrand)
  );

  constructor(private readonly store: Store<ArticlesPartialState>) {}

  getCurrentArticle(payload: GetArticlePayload): void {
    this.store.dispatch(fromArticlesActions.getArticle({ payload }));
  }

  getArticlesForNode(payload: GetArticlesForNodePayload): void {
    this.store.dispatch(fromArticlesActions.getArticlesForNode({ payload }));
  }

  getArticlesForBrand(payload: GetArticlesForBrandPayload): void {
    this.store.dispatch(fromArticlesActions.getArticlesForBrand({ payload }));
  }
}
