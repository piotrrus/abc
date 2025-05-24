import { ActionPayload } from '@ems/shared/domain';
import { createAction, props } from '@ngrx/store';
import {
  GetArticlePayload,
  GetArticleSuccessPayload,
  GetArticleFailPayload,
  GetArticlesForNodePayload,
  GetArticlesForNodeSuccessPayload,
  GetArticlesForNodeFailPayload,
  GetArticlesForBrandFailPayload,
  GetArticlesForBrandSuccessPayload,
  GetArticlesForBrandPayload,
} from '@ems/euro-mobile/articles/domain';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace fromArticlesActions {
  export enum Types {
    GetArticle = '[Articles] Get Article',
    GetArticleSuccess = '[Articles] Get Article Success',
    GetArticleFail = '[Articles] Get Article Fail',
    GetArticlesForNode = '[Articles] Get Articles For Node',
    GetArticlesForNodeSuccess = '[Articles] Get Articles For Node Success',
    GetArticlesForNodeFail = '[Articles] Get Articles For Node Fail',
    GetArticlesForBrand = '[Articles] Get Articles For Brand',
    GetArticlesForBrandSuccess = '[Articles] Get Articles For Brand Success',
    GetArticlesForBrandFail = '[Articles] Get Articles For Brand Fail',
  }

  export const getArticle = createAction(
    Types.GetArticle,
    props<ActionPayload<GetArticlePayload>>()
  );

  export const getArticleSuccess = createAction(
    Types.GetArticleSuccess,
    props<ActionPayload<GetArticleSuccessPayload>>()
  );

  export const getArticleFail = createAction(
    Types.GetArticleFail,
    props<ActionPayload<GetArticleFailPayload>>()
  );

  export const getArticlesForNode = createAction(
    Types.GetArticlesForNode,
    props<ActionPayload<GetArticlesForNodePayload>>()
  );

  export const getArticlesForNodeSuccess = createAction(
    Types.GetArticlesForNodeSuccess,
    props<ActionPayload<GetArticlesForNodeSuccessPayload>>()
  );

  export const getArticlesForNodeFail = createAction(
    Types.GetArticlesForNodeFail,
    props<ActionPayload<GetArticlesForNodeFailPayload>>()
  );

  export const getArticlesForBrand = createAction(
    Types.GetArticlesForBrand,
    props<ActionPayload<GetArticlesForBrandPayload>>()
  );

  export const getArticlesForBrandSuccess = createAction(
    Types.GetArticlesForBrandSuccess,
    props<ActionPayload<GetArticlesForBrandSuccessPayload>>()
  );

  export const getArticlesForBrandFail = createAction(
    Types.GetArticlesForBrandFail,
    props<ActionPayload<GetArticlesForBrandFailPayload>>()
  );
}
