import {
  AddCartItemFailPayload,
  AddCartItemPayload,
  AddCartItemSuccessPayload,
  AddInsuranceToCartItemFailPayload,
  AddInsuranceToCartItemPayload,
  AddInsuranceToSetFailPayload,
  AddInsuranceToSetPayload,
  AddPackageFailPayload,
  AddPackagePayload,
  AddPackageSuccessPayload,
  AddServiceFailPayload,
  AddServicePayload,
  AddServiceSuccessPayload,
  CreateCartFailPayload,
  CreateCartSuccessPayload,
  DeleteServiceFailPayload,
  DeleteServicePayload,
  DeleteServiceSuccessPayload,
  GetCartFailPayload,
  GetCartItemsFailPayload,
  GetCartItemsSuccessPayload,
  GetCartSuccessPayload,
  GetDeliveryTimeCollectionFailPayload,
  GetDeliveryTimeCollectionSuccessPayload,
  GetFailPayload,
  GetProductInsurancesEncouragementsForCartPayload,
  GetProductInsurancesEncouragementsForCartSuccessPayload,
  GetRecommendedInsurancesSuccessPayload,
  GetServicesFailPayload,
  GetServicesPayload,
  GetServicesSuccessPayload,
  GetSetInsurancesEncouragementsForCartPayload,
  GetSetInsurancesEncouragementsForCartSuccessPayload,
  GetZipCodeFromCoordinatesFailPayload,
  GetZipCodeFromCoordinatesSuccessPayload,
  UpdateDeliveryTimeFailPayload,
  UpdateDeliveryTimePayload,
  UpdatePaymentTypeFailPayload,
  UpdatePaymentTypePayload,
  UpdateShopCodeFailPayload,
  UpdateShopCodePayload,
  UpdateZipCodeFailPayload,
  UpdateZipCodePayload,
} from '@ems/euro-mobile/cart/domain';
import { ActionPayload } from '@ems/shared/domain';
import {
  EncouragementInsurance,
  GetInsurancesEncouragementDetailsRequestParams,
  GetInsurancesRecommendedRequestParams,
} from '@ems/shared/domain-openapi-contracts/insurances';
import { createAction, props } from '@ngrx/store';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace fromCartActions {
  export enum Types {
    GetCart = '[Cart] Get Cart',
    GetCartSuccess = '[Cart] Get Cart Success',
    GetCartFail = '[Cart] Get Cart Fail',
    GetCartItems = '[Cart] Get Cart Items',
    GetCartItemsSuccess = '[Cart] Get Cart Items Success',
    GetCartItemsFail = '[Cart] Get Cart Items Fail',
    CreateCart = '[Cart] Create Cart',
    CreateCartSuccess = '[Cart] Create Cart Success',
    CreateCartFail = '[Cart] Create Cart Fail',
    AddCartItem = '[Cart] Add Cart Item',
    AddCartItemSuccess = '[Cart] Add Cart Item Success',
    AddCartItemFail = '[Cart] Add Cart Item Fail',
    AddPackage = '[Cart] Add Package',
    AddPackageFail = '[Cart] Add Package Fail',
    AddPackageSuccess = '[Cart] Add Package Success',
    UpdatePaymentType = '[Cart] Update Payment Type',
    UpdatePaymentTypeSuccess = '[Cart] Update Payment Type Success',
    UpdatePaymentTypeFail = '[Cart] Update Payment Type Fail',
    UpdateShopCode = '[Cart] Update Shop Code',
    UpdateShopCodeSuccess = '[Cart] Update Shop Code Success',
    UpdateShopCodeFail = '[Cart] Update Shop Code Fail',
    GetDeliveryTimeCollection = '[Cart] Get Delivery Time Collection',
    GetDeliveryTimeCollectionSuccess = '[Cart] Get Delivery Time Collection Success',
    GetDeliveryTimeCollectionFail = '[Cart] Get Delivery Time Collection Fail',
    UpdateDeliveryTime = '[Cart] Update Delivery Time',
    UpdateDeliveryTimeSuccess = '[Cart] Update Delivery Time Success',
    UpdateDeliveryTimeFail = '[Cart] Update Delivery Time Fail',
    UpdateZipCode = '[Cart] Update Zip Code',
    UpdateZipCodeSuccess = '[Cart] Update Zip Code Success',
    UpdateZipCodeFail = '[Cart] Update Zip Code Fail',
    ClearZipCodeErrorsAndSuggestion = '[Cart] Clear Zip Code Errors And Suggestion',
    ClearZipCode = '[Cart] Clear Zip Code',
    GetZipCodeFromCoordinates = '[Cart] Get Zip Code From Coordinates',
    GetZipCodeFromCoordinatesSuccess = '[Cart] Get Zip Code From Coordinates Success',
    GetZipCodeFromCoordinatesFail = '[Cart] Get Zip Code From Coordinates Fail',
    GetServices = '[Cart] Services',
    GetServicesSuccess = '[Cart] Services Success',
    GetServicesFail = '[Cart] Services Fail',
    AddService = '[Cart] Add Service',
    AddServiceSuccess = '[Cart] Add Service Success',
    AddServiceFail = '[Cart] Add Service Fail',
    DeleteService = '[Cart] Delete Service',
    DeleteServiceSuccess = '[Cart] Delete Service Success',
    DeleteServiceFail = '[Cart] Delete Service Fail',
    GetRecommendedInsurances = '[Cart] Get Recommended Insurances',
    GetRecommendedInsurancesSuccess = '[Cart] Get Recommended Insurances Success',
    GetRecommendedInsurancesFail = '[Cart] Get Recommended Insurances Fail',
    GetInsurancesEncouragements = '[Cart] Get Insurances Encouragements',
    GetInsurancesEncouragementsSuccess = '[Cart] Get Insurances Encouragements Success',
    GetInsurancesEncouragementsFail = '[Cart] Get Insurances Encouragements Fail',
    GetInsuranceById = '[Cart] Get Insurance By ID',
    GetInsuranceByIdFail = '[Cart] Get Insurance By ID Fail',
    GetInsuranceByIdSuccess = '[Cart] Get Insurance By ID Success',
    GetProductInsurancesEncouragementsForCart = '[Cart] Get Product Insurances Encouragements For Cart',
    GetProductInsurancesEncouragementsForCartFail = '[Cart] Get Product Insurances Encouragements For Cart Fail',
    GetProductInsurancesEncouragementsForCartSuccess = '[Cart] Get Product Insurances Encouragements For Cart Success',
    GetSetInsurancesEncouragementsForCart = '[Cart] Get Set Insurances Encouragements For Cart',
    GetSetInsurancesEncouragementsForCartFail = '[Cart] Get Set Insurances Encouragements For Cart Fail',
    GetSetInsurancesEncouragementsForCartSuccess = '[Cart] Get Set Insurances Encouragements For Cart Success',
    AddInsuranceToCartItem = '[Cart] Add Insurance To Cart Item',
    AddInsuranceToCartItemFail = '[Cart] Add Insurance To Cart Item Fail',
    AddInsuranceToCartItemSuccess = '[Cart] Add Insurance To Cart Item Success',
    AddInsuranceToSet = '[Cart] Add Insurance To Set',
    AddInsuranceToSetFail = '[Cart] Add Insurance To Set Fail',
    AddInsuranceToSetSuccess = '[Cart] Add Insurance To Set Success',
    RedirectToCart = '[Cart] Redirect To Cart',
  }

  export const getCart = createAction(Types.GetCart);

  export const getCartSuccess = createAction(
    Types.GetCartSuccess,
    props<ActionPayload<GetCartSuccessPayload>>(),
  );

  export const getCartFail = createAction(
    Types.GetCartFail,
    props<ActionPayload<GetCartFailPayload>>(),
  );

  export const getCartItems = createAction(Types.GetCartItems);

  export const getCartItemsSuccess = createAction(
    Types.GetCartItemsSuccess,
    props<ActionPayload<GetCartItemsSuccessPayload>>(),
  );

  export const getCartItemsFail = createAction(
    Types.GetCartItemsFail,
    props<ActionPayload<GetCartItemsFailPayload>>(),
  );

  export const createCart = createAction(Types.CreateCart);

  export const createCartSuccess = createAction(
    Types.CreateCartSuccess,
    // @TODO if backend sets the cookie then remove this payload
    props<ActionPayload<CreateCartSuccessPayload>>(),
  );

  export const createCartFail = createAction(
    Types.CreateCartFail,
    props<ActionPayload<CreateCartFailPayload>>(),
  );

  export const addCartItem = createAction(
    Types.AddCartItem,
    props<ActionPayload<AddCartItemPayload>>(),
  );

  export const addCartItemSuccess = createAction(
    Types.AddCartItemSuccess,
    props<ActionPayload<AddCartItemSuccessPayload>>(),
  );

  export const addCartItemFail = createAction(
    Types.AddCartItemFail,
    props<ActionPayload<AddCartItemFailPayload>>(),
  );

  export const addPackage = createAction(
    Types.AddPackage,
    props<ActionPayload<AddPackagePayload>>(),
  );

  export const addPackageFail = createAction(
    Types.AddPackageFail,
    props<ActionPayload<AddPackageFailPayload>>(),
  );

  export const addPackageSuccess = createAction(
    Types.AddPackageSuccess,
    props<ActionPayload<AddPackageSuccessPayload>>(),
  );

  export const updatePaymentType = createAction(
    Types.UpdatePaymentType,
    props<ActionPayload<UpdatePaymentTypePayload>>(),
  );

  export const updatePaymentTypeSuccess = createAction(
    Types.UpdatePaymentTypeSuccess,
  );

  export const updatePaymentTypeFail = createAction(
    Types.UpdatePaymentTypeFail,
    props<ActionPayload<UpdatePaymentTypeFailPayload>>(),
  );

  export const updateShopCode = createAction(
    Types.UpdateShopCode,
    props<ActionPayload<UpdateShopCodePayload>>(),
  );

  export const updateShopCodeSuccess = createAction(
    Types.UpdateShopCodeSuccess,
  );

  export const updateShopCodeFail = createAction(
    Types.UpdateShopCodeFail,
    props<ActionPayload<UpdateShopCodeFailPayload>>(),
  );

  export const getDeliveryTimeCollection = createAction(
    Types.GetDeliveryTimeCollection,
  );

  export const getDeliveryTimeCollectionSuccess = createAction(
    Types.GetDeliveryTimeCollectionSuccess,
    props<ActionPayload<GetDeliveryTimeCollectionSuccessPayload>>(),
  );

  export const getDeliveryTimeCollectionFail = createAction(
    Types.GetDeliveryTimeCollectionFail,
    props<ActionPayload<GetDeliveryTimeCollectionFailPayload>>(),
  );

  export const updateDeliveryTime = createAction(
    Types.UpdateDeliveryTime,
    props<ActionPayload<UpdateDeliveryTimePayload>>(),
  );

  export const updateDeliveryTimeSuccess = createAction(
    Types.UpdateDeliveryTimeSuccess,
  );

  export const updateDeliveryTimeFail = createAction(
    Types.UpdateDeliveryTimeFail,
    props<ActionPayload<UpdateDeliveryTimeFailPayload>>(),
  );

  export const updateZipCode = createAction(
    Types.UpdateZipCode,
    props<ActionPayload<UpdateZipCodePayload>>(),
  );

  export const updateZipCodeSuccess = createAction(
    Types.UpdateZipCodeSuccess,
    props<ActionPayload<UpdateZipCodePayload>>(),
  );

  export const updateZipCodeFail = createAction(
    Types.UpdateZipCodeFail,
    props<ActionPayload<UpdateZipCodeFailPayload>>(),
  );

  export const clearZipCode = createAction(Types.ClearZipCode);
  export const clearZipCodeErrorsAndSuggestion = createAction(
    Types.ClearZipCodeErrorsAndSuggestion,
  );

  export const getZipCodeFromCoordinates = createAction(
    Types.GetZipCodeFromCoordinates,
  );

  export const getZipCodeFromCoordinatesSuccess = createAction(
    Types.GetZipCodeFromCoordinatesSuccess,
    props<ActionPayload<GetZipCodeFromCoordinatesSuccessPayload>>(),
  );

  export const getZipCodeFromCoordinatesFail = createAction(
    Types.GetZipCodeFromCoordinatesFail,
    props<ActionPayload<GetZipCodeFromCoordinatesFailPayload>>(),
  );

  export const getServices = createAction(
    Types.GetServices,
    props<ActionPayload<GetServicesPayload>>(),
  );

  export const getServicesSuccess = createAction(
    Types.GetServicesSuccess,
    props<ActionPayload<GetServicesSuccessPayload[]>>(),
  );

  export const getServicesFail = createAction(
    Types.GetServicesFail,
    props<ActionPayload<GetServicesFailPayload>>(),
  );

  export const addService = createAction(
    Types.AddService,
    props<ActionPayload<AddServicePayload>>(),
  );

  export const addServiceSuccess = createAction(
    Types.AddServiceSuccess,
    props<ActionPayload<AddServiceSuccessPayload>>(),
  );

  export const addServiceFail = createAction(
    Types.AddServiceFail,
    props<ActionPayload<AddServiceFailPayload>>(),
  );

  export const deleteService = createAction(
    Types.DeleteService,
    props<ActionPayload<DeleteServicePayload>>(),
  );

  export const deleteServiceSuccess = createAction(
    Types.DeleteServiceSuccess,
    props<ActionPayload<DeleteServiceSuccessPayload>>(),
  );

  export const deleteServiceFail = createAction(
    Types.DeleteServiceFail,
    props<ActionPayload<DeleteServiceFailPayload>>(),
  );

  export const getRecommendedInsurances = createAction(
    Types.GetRecommendedInsurances,
    props<ActionPayload<GetInsurancesRecommendedRequestParams>>(),
  );

  export const getRecommendedInsurancesSuccess = createAction(
    Types.GetRecommendedInsurancesSuccess,
    props<ActionPayload<GetRecommendedInsurancesSuccessPayload>>(),
  );

  export const getRecommendedInsurancesFail = createAction(
    Types.GetRecommendedInsurancesFail,
    props<ActionPayload<GetFailPayload>>(),
  );

  export const getInsurancesEncouragements = createAction(
    Types.GetInsurancesEncouragements,
    props<ActionPayload<GetInsurancesEncouragementDetailsRequestParams>>(),
  );

  export const getInsurancesEncouragementsSuccess = createAction(
    Types.GetInsurancesEncouragementsSuccess,
    props<ActionPayload<EncouragementInsurance>>(),
  );

  export const getInsurancesEncouragementsFail = createAction(
    Types.GetInsurancesEncouragementsFail,
    props<ActionPayload<GetFailPayload>>(),
  );

  export const getProductInsurancesEncouragementsForCart = createAction(
    Types.GetProductInsurancesEncouragementsForCart,
    props<ActionPayload<GetProductInsurancesEncouragementsForCartPayload>>(),
  );

  export const getProductInsurancesEncouragementsForCartFail = createAction(
    Types.GetProductInsurancesEncouragementsForCartFail,
    props<ActionPayload<GetFailPayload>>(),
  );

  export const getProductInsurancesEncouragementsForCartSuccess = createAction(
    Types.GetProductInsurancesEncouragementsForCartSuccess,
    props<
      ActionPayload<GetProductInsurancesEncouragementsForCartSuccessPayload>
    >(),
  );

  export const getSetInsurancesEncouragementsForCart = createAction(
    Types.GetSetInsurancesEncouragementsForCart,
    props<ActionPayload<GetSetInsurancesEncouragementsForCartPayload>>(),
  );

  export const getSetInsurancesEncouragementsForCartFail = createAction(
    Types.GetSetInsurancesEncouragementsForCartFail,
    props<ActionPayload<GetFailPayload>>(),
  );

  export const getSetInsurancesEncouragementsForCartSuccess = createAction(
    Types.GetSetInsurancesEncouragementsForCartSuccess,
    props<ActionPayload<GetSetInsurancesEncouragementsForCartSuccessPayload>>(),
  );

  export const addInsuranceToCartItem = createAction(
    Types.AddInsuranceToCartItem,
    props<ActionPayload<AddInsuranceToCartItemPayload>>(),
  );

  export const addInsuranceToCartItemFail = createAction(
    Types.AddInsuranceToCartItemFail,
    props<ActionPayload<AddInsuranceToCartItemFailPayload>>(),
  );

  export const addInsuranceToCartItemSuccess = createAction(
    Types.AddInsuranceToCartItemSuccess,
  );

  export const addInsuranceToSet = createAction(
    Types.AddInsuranceToSet,
    props<ActionPayload<AddInsuranceToSetPayload>>(),
  );

  export const addInsuranceToSetFail = createAction(
    Types.AddInsuranceToSetFail,
    props<ActionPayload<AddInsuranceToSetFailPayload>>(),
  );

  export const addInsuranceToSetSuccess = createAction(
    Types.AddInsuranceToSetSuccess,
  );

  export const redirectToCart = createAction(
    Types.RedirectToCart,
    props<
      ActionPayload<AddCartItemSuccessPayload | AddPackageSuccessPayload>
    >(),
  );
}
