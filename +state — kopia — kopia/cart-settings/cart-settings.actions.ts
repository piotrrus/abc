import { createAction, props } from '@ngrx/store';
import { ActionPayload } from '@ems/shared/domain';
import { GetCartSettingsCollectionFailPayload, GetCartSettingsCollectionSuccessPayload } from '@ems/euro-mobile/cart/domain';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace fromCartSettingsActions {
  export enum Types {
    GetCartSettingsCollection = '[Cart Settings] Get Cart Cart Settings Collection',
    GetCartSettingsCollectionSuccess = '[Cart Settings] Get Cart Cart Settings Collection Success',
    GetCartSettingsCollectionFail = '[Cart Settings] Get Cart Cart Settings Collection Fail',
  }

  export const getCartSettingsCollection = createAction(
    Types.GetCartSettingsCollection
  );

  export const getCartSettingsCollectionSuccess = createAction(
    Types.GetCartSettingsCollectionSuccess,
    props<ActionPayload<GetCartSettingsCollectionSuccessPayload>>()
  );

  export const getCartSettingsCollectionFail = createAction(
    Types.GetCartSettingsCollectionFail,
    props<ActionPayload<GetCartSettingsCollectionFailPayload>>()
  );
}
