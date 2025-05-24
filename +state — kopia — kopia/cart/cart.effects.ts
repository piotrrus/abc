import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AddCartItemSuccessPayload,
  AddPackageSuccessPayload,
  AddServiceSuccessPayload,
  AddToCartNotAcceptableError,
  ZipCodeErrorResponse,
} from '@ems/euro-mobile/cart/domain';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  AddCartItemWithAdditionalInfoHandler,
  AddToCartItemErrorHandlerService,
} from '../../../../../feature-error-handler/src';
import {
  CartDataService,
  HomeDeliveryDataService,
  InsurancesDataService,
  ServicesDataService,
} from '@ems/euro-mobile/cart/infrastructure';
import { ApiError, LocationError } from '@ems/shared/domain';
import { XOR } from '@ems/shared/util';
import { FeatureTogglesService } from '@ems/shared/util-feature-toggles';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { fetch, optimisticUpdate, pessimisticUpdate } from '@nx/angular';
import { combineLatest, withLatestFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { cartQuery } from './cart.selectors';
import { CartIdFacade } from '../cart-id/cart-id-facade';
import { fromCartActions } from './cart.actions';
import { CartPartialState } from './cart.reducer';
import { TypedAction } from '@ngrx/store/src/models';
import { InsurancesApiService } from '@ems/shared/domain-openapi-contracts/insurances';

@Injectable()
export class CartEffects {
  getCartItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.getCartItems),
      fetch({
        run: () => {
          const euroCartCookie = this.cartIdFacade.getCartId();
          return this.handleGetCartItems(euroCartCookie);
        },
        onError: (action, error: ApiError) => {
          return this.handleGetCartItemsFail(error);
        },
      }),
    ),
  );

  addCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.addCartItem),
      optimisticUpdate({
        run: ({ payload }) => {
          return this.cartDataService
            .addCartItem(
              {
                instalmentOptionCode: payload.instalmentOptionCode,
                instalmentNumber: payload.instalmentNumber,
                product: payload.identifiers.plu,
                addedFrom: payload.addedFrom,
                cameFrom: 'string',
                services: payload.services,
                insurance: payload.insurance,
                outletCategory: payload.outletCategory,
                huCode: payload.huCode,
                shopCode: payload.shopCode,
                voucherCode: payload.voucherCode,
              },
              this.cartIdFacade.getCartId(),
            )
            .pipe(
              map((data) =>
                fromCartActions.addCartItemSuccess({
                  payload: {
                    insuranceEncouragementAvailable:
                      data.insuranceEncouragementAvailable,
                    messageForUser: data.messageForUser,
                    accessoriesToCartAvailable: data.accessoriesToCartAvailable,
                    noRedirect: payload.noRedirect,
                    productLinkName: payload.identifiers.productLinkName,
                    productPlu: payload.identifiers.plu,
                    redirectToCart: payload.redirectToCart,
                  },
                }),
              ),
            );
        },
        undoAction: (
          { payload },
          error: XOR<
            ApiError,
            ApiError & {
              error: AddToCartNotAcceptableError;
            }
          >,
        ) => {
          return fromCartActions.addCartItemFail({
            payload: {
              error,
              plu: payload.identifiers.plu,
              productName: payload.name,
            },
          });
        },
      }),
    ),
  );

  addCartItemSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromCartActions.addCartItemSuccess,
        fromCartActions.addPackageSuccess,
      ),
      fetch({
        run: ({ payload }): TypedAction<any> | void => {
          // @todo new cart
          // if (payload.services && payload.services.length > 0) {
          //   return this.getCartAndAddServices(
          //     payload.productPlu,
          //     payload.services
          //   );
          // }
          if (payload.messageForUser) {
            this.addCartItemSuccessHandler.handle(payload, () =>
              this.redirectToCart({
                ...payload,
                noRedirect: false,
                redirectToCart: true,
              }),
            );
            return;
          }
          if (payload.insuranceEncouragementAvailable) {
            const cartId = this.cartIdFacade.getCartId();

            if ('dynamicSetAccessoriesIdentifier' in payload) {
              return fromCartActions.getSetInsurancesEncouragementsForCart({
                payload: {
                  dynamicSetAccessoriesIdentifier:
                    payload.dynamicSetAccessoriesIdentifier,
                  cartId,
                  redirectToCartPayload: payload,
                },
              });
            }

            // check
            if ('productPlu' in payload) {
              return fromCartActions.getProductInsurancesEncouragementsForCart({
                payload: {
                  productPlu: payload.productPlu,
                  cartId,
                  redirectToCartPayload: payload,
                },
              });
            }
          }

          this.redirectToCart(payload);
        },
        onError: (_, error: ApiError) => {
          return this.handleAddServiceFail(error);
        },
      }),
    ),
  );

  addCartItemFail$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType(fromCartActions.addCartItemFail, fromCartActions.addPackageFail),
        tap(({ payload }) => {
          this.errorHandlerService.handleError(payload);
        }),
      ),
    { dispatch: false },
  );

  addPackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.addPackage),
      optimisticUpdate({
        run: ({ payload }) => {
          return this.cartDataService
            .addPackage(
              {
                product: payload.identifiers.plu,
                addedFrom: payload.addedFrom,
                cameFrom: 'string',
                packageElements: payload.packageElements,
                services: payload.services,
              },
              this.cartIdFacade.getCartId(),
            )
            .pipe(
              map((data) =>
                fromCartActions.addPackageSuccess({ payload: data }),
              ),
            );
        },
        undoAction: (
          { payload },
          error: XOR<
            ApiError,
            ApiError & {
              error: AddToCartNotAcceptableError;
            }
          >,
        ) => {
          return fromCartActions.addPackageFail({
            payload: {
              error,
              plu: payload.identifiers.plu,
              productName: payload.name,
            },
          });
        },
      }),
    ),
  );

  getProductInsurancesEncouragementsForCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.getProductInsurancesEncouragementsForCart),
      fetch({
        run: ({ payload }) => {
          const payloadForOpenApi =
            this.insurancesDataService.prepareArgumentsForOpenApiMethods(
              payload,
            );
          return this.insurancesApiService
            .getInsurancesEncouragementForProduct(...payloadForOpenApi)
            .pipe(
              map((response) =>
                fromCartActions.getProductInsurancesEncouragementsForCartSuccess(
                  {
                    payload: {
                      insurancesEncouragements: response,
                      redirectToCartPayload: payload.redirectToCartPayload,
                    },
                  },
                ),
              ),
            );
        },
        onError: (action, error: ApiError) => {
          return fromCartActions.getProductInsurancesEncouragementsForCartFail({
            payload: { error },
          });
        },
      }),
    ),
  );

  getSetInsurancesEncouragementsForCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.getSetInsurancesEncouragementsForCart),
      fetch({
        run: ({ payload }) => {
          const payloadForOpenApi =
            this.insurancesDataService.prepareArgumentsForOpenApiMethods(
              payload,
            );
          return this.insurancesApiService
            .getInsuranceEncouragementForDynamicSetAccessories(
              ...payloadForOpenApi,
            )
            .pipe(
              map((response) =>
                fromCartActions.getSetInsurancesEncouragementsForCartSuccess({
                  payload: {
                    insurancesEncouragements: response,
                    redirectToCartPayload: payload.redirectToCartPayload,
                  },
                }),
              ),
            );
        },
        onError: (action, error: ApiError) => {
          return fromCartActions.getSetInsurancesEncouragementsForCartFail({
            payload: { error },
          });
        },
      }),
    ),
  );

  updatePaymentType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.updatePaymentType),
      optimisticUpdate({
        run: ({ payload }) => {
          return this.cartDataService
            .updatePaymentType({
              ...payload,
              cartId: this.cartIdFacade.getCartId(),
            })
            .pipe(map(() => fromCartActions.updatePaymentTypeSuccess()));
        },
        undoAction: (_, error: ApiError) => {
          return fromCartActions.updatePaymentTypeFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  updateShopCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.updateShopCode),
      optimisticUpdate({
        run: ({ payload }) => {
          return this.cartDataService
            .updateShopCode({
              shopCode: payload.shop.shopCode,
              cartId: this.cartIdFacade.getCartId(),
            })
            .pipe(map(() => fromCartActions.updateShopCodeSuccess()));
        },
        undoAction: (_, error: ApiError) => {
          return fromCartActions.updateShopCodeFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  getDeliveryTimeCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.getDeliveryTimeCollection),
      fetch({
        run: () => {
          return this.cartDataService
            .getDeliveryTimeCollection({
              cartId: this.cartIdFacade.getCartId(),
            })
            .pipe(
              map((data) =>
                fromCartActions.getDeliveryTimeCollectionSuccess({
                  payload: { data },
                }),
              ),
            );
        },
        onError: (action, error: ApiError) => {
          return fromCartActions.getDeliveryTimeCollectionFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  updateDeliveryTime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.updateDeliveryTime),
      optimisticUpdate({
        run: ({ payload }) => {
          return this.cartDataService
            .updateDeliveryTime({
              cartId: this.cartIdFacade.getCartId(),
              deliveryTime: payload.deliveryTime,
            })
            .pipe(map(() => fromCartActions.updateDeliveryTimeSuccess()));
        },
        undoAction: (_, error: ApiError) => {
          return fromCartActions.updateDeliveryTimeFail({
            payload: {
              error,
              deliveryTime: null,
            },
          });
        },
      }),
    ),
  );

  updateZipCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.updateZipCode),
      pessimisticUpdate({
        run: ({ payload }) => {
          return this.homeDeliveryDataService
            .updateZipCode({
              cartId: this.cartIdFacade.getCartId(),
              zipCode: payload.zipCode,
              confirmed: payload.confirmed,
              city: payload.city,
            })
            .pipe(map(() => fromCartActions.updateZipCodeSuccess({ payload })));
        },
        onError: (action, error: ZipCodeErrorResponse) => {
          // TODO temp. condition (BE not ready)
          if (error.error === 'AMBIGUOUS_CITY') {
            return fromCartActions.updateZipCodeFail({
              payload: {
                error: {
                  ...error,
                  possibleCity: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'],
                },
              },
            });
          }

          return fromCartActions.updateZipCodeFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  getZipCodeFromCoordinates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.getZipCodeFromCoordinates),
      pessimisticUpdate({
        run: () => {
          return this.homeDeliveryDataService
            .getZipCodeFromCoordinates()
            .pipe(
              map((payload) =>
                fromCartActions.getZipCodeFromCoordinatesSuccess({ payload }),
              ),
            );
        },
        onError: (_action, error: LocationError) => {
          return fromCartActions.getZipCodeFromCoordinatesFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  getServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.getServices),
      pessimisticUpdate({
        run: ({ payload }) => {
          const observables = payload.productPlu.map((plu) => {
            return this.servicesDataService.getServices(plu);
          });
          return combineLatest(observables).pipe(
            map((payload) => fromCartActions.getServicesSuccess({ payload })),
          );
        },
        onError(action, error: ApiError): Action {
          return fromCartActions.getServicesFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  addService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.addService),
      pessimisticUpdate({
        run: ({ payload }) => {
          return this.servicesDataService
            .addService({ ...payload, orderId: this.cartIdFacade.getCartId() })
            .pipe(map((data) => this.handleAddServiceSuccess(data)));
        },
        onError(action, error: ApiError): Action {
          return this.handleAddServiceFail(error);
        },
      }),
    ),
  );

  deleteService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.deleteService),
      pessimisticUpdate({
        run: ({ payload }) => {
          return this.servicesDataService
            .deleteService({
              ...payload,
              orderId: this.cartIdFacade.getCartId(),
            })
            .pipe(
              map((payload) =>
                fromCartActions.deleteServiceSuccess({ payload }),
              ),
            );
        },
        onError(action, error: ApiError): Action {
          return fromCartActions.deleteServiceFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  updateServiceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromCartActions.deleteServiceSuccess,
        fromCartActions.addServiceSuccess,
        fromCartActions.addCartItemSuccess,
      ),
      // map(() => fromCartActions.getCart()),
      map(() => fromCartActions.getCartItems()),
    ),
  );

  getRecommendedInsurances$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.getRecommendedInsurances),
      fetch({
        run: ({ payload }) => {
          return this.insurancesDataService
            .getRecommendedInsurances(payload)
            .pipe(
              map((response) =>
                fromCartActions.getRecommendedInsurancesSuccess({
                  payload: response,
                }),
              ),
            );
        },
        onError: (action, error: ApiError) => {
          return fromCartActions.getRecommendedInsurancesFail({
            payload: { error },
          });
        },
      }),
    ),
  );

  getInsurancesEncouragements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.getInsurancesEncouragements),
      fetch({
        run: ({ payload }) => {
          const payloadForOpenApi =
            this.insurancesDataService.prepareArgumentsForOpenApiMethods(
              payload,
            );
          return this.insurancesApiService
            .getInsurancesEncouragementDetails(...payloadForOpenApi)
            .pipe(
              map((response) =>
                fromCartActions.getInsurancesEncouragementsSuccess({
                  payload: response,
                }),
              ),
            );
        },
        onError: (action, error: ApiError) => {
          return fromCartActions.getInsurancesEncouragementsFail({
            payload: { error },
          });
        },
      }),
    ),
  );

  addInsuranceToCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.addInsuranceToCartItem),
      fetch({
        run: ({ payload }) => {
          return this.cartDataService
            .addInsuranceToProduct({
              cartId: this.cartIdFacade.getCartId(),
              ...payload,
            })
            .pipe(map(() => fromCartActions.addInsuranceToCartItemSuccess()));
        },
        onError: (action, error: ApiError) => {
          return fromCartActions.addInsuranceToCartItemFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  addInsuranceToSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.addInsuranceToSet),
      fetch({
        run: ({ payload }) => {
          return this.cartDataService
            .addInsuranceToSet({
              ...payload,
              cartId: this.cartIdFacade.getCartId(),
            })
            .pipe(map(() => fromCartActions.addInsuranceToSetSuccess()));
        },
        onError: (action, error: ApiError) => {
          return fromCartActions.addInsuranceToSetFail({
            payload: {
              error,
            },
          });
        },
      }),
    ),
  );

  addInsuranceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromCartActions.addInsuranceToCartItemSuccess,
        fromCartActions.addInsuranceToSetSuccess,
      ),
      withLatestFrom(
        this.store$.pipe(select(cartQuery.getRedirectToCartPayload)),
      ),
      map(([action, data]) =>
        fromCartActions.redirectToCart({ payload: data }),
      ),
    ),
  );

  redirectToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCartActions.redirectToCart),
      fetch({
        run: ({ payload }) => {
          this.redirectToCart(payload);
        },
      }),
    ),
  );

  private handleGetCartItems(cartId: string) {
    return this.cartDataService.getCartItems(cartId).pipe(
      map((data) =>
        fromCartActions.getCartItemsSuccess({
          payload: data,
        }),
      ),
    );
  }

  private handleGetCartItemsFail(error) {
    return fromCartActions.getCartItemsFail({
      payload: {
        error,
      },
    });
  }

  private handleAddServiceFail(error) {
    return fromCartActions.addServiceFail({
      payload: {
        error,
      },
    });
  }

  private handleAddServiceSuccess(payload: AddServiceSuccessPayload) {
    return fromCartActions.addServiceSuccess({
      payload,
    });
  }

  private redirectToCart(
    payload: AddCartItemSuccessPayload | AddPackageSuccessPayload,
  ): void {
    if (payload.noRedirect) {
      return;
    }
    if (payload.redirectToCart) {
      this.document.location.href = 'cart.bhtml';
      return;
    }
    if (payload.accessoriesToCartAvailable) {
      if ('dynamicSetAccessoriesIdentifier' in payload) {
        this.document.location.href = `pakiet-${payload.dynamicSetAccessoriesIdentifier}/to-cart.bhtml`;
        return;
      }
      if (
        'productLinkName' in payload &&
        !('relatedPromotionIdentifier' in payload)
      ) {
        this.document.location.href = `${payload.productLinkName}/to-cart.bhtml`;
        return;
      }
      if ('relatedPromotionIdentifier' in payload) {
        this.document.location.href = `promocja-${payload.relatedPromotionIdentifier}/to-cart.bhtml`;
        return;
      }
    }
    this.document.location.href = 'cart.bhtml';
  }

  constructor(
    private readonly actions$: Actions,
    private readonly cartDataService: CartDataService,
    private readonly servicesDataService: ServicesDataService,
    private readonly cartIdFacade: CartIdFacade,
    private readonly insurancesDataService: InsurancesDataService,
    private readonly store$: Store<CartPartialState>,
    private readonly homeDeliveryDataService: HomeDeliveryDataService,
    private readonly router: Router,
    private readonly errorHandlerService: AddToCartItemErrorHandlerService,
    private readonly addCartItemSuccessHandler: AddCartItemWithAdditionalInfoHandler,
    private readonly featureToggleService: FeatureTogglesService,
    private readonly insurancesApiService: InsurancesApiService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}
}
