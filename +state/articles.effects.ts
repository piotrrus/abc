import { Injectable } from '@angular/core';
import { ArticlesDataService } from '@ems/euro-mobile/articles/infrastructure';
import { ApiError } from '@ems/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nx/angular';
import { map } from 'rxjs/operators';
import { fromArticlesActions } from './articles.actions';

@Injectable()
export class ArticlesEffects {
  getCurrentArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromArticlesActions.getArticle),
      fetch({
        run: ({ payload }) => {
          return this.articleDataService
            .getArticle(payload)
            .pipe(
              map((data) =>
                fromArticlesActions.getArticleSuccess({ payload: data }),
              ),
            );
        },
        onError: (action, error: ApiError) => {
          return fromArticlesActions.getArticleFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  getArticlesForNode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromArticlesActions.getArticlesForNode),
      fetch({
        run: ({ payload }) => {
          return this.articleDataService.getArticlesForNode(payload).pipe(
            map((data) =>
              fromArticlesActions.getArticlesForNodeSuccess({
                payload: data,
              }),
            ),
          );
        },
        onError: (action, error: ApiError) => {
          return fromArticlesActions.getArticlesForNodeFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  getArticlesForBrand$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromArticlesActions.getArticlesForBrand),
      fetch({
        run: ({ payload }) => {
          return this.articleDataService.getArticlesForBrand(payload).pipe(
            map((data) =>
              fromArticlesActions.getArticlesForBrandSuccess({
                payload: data,
              }),
            ),
          );
        },
        onError: (action, error: ApiError) => {
          return fromArticlesActions.getArticlesForBrandFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly articleDataService: ArticlesDataService,
  ) {}
}
