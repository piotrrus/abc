import { Injectable } from '@angular/core';
import {
  AddCartItemSuccessPayload,
  AddedItemFromType,
  AddInsuranceToCartItemPayload,
  AddInsuranceToSetPayload,
  AddPackageSuccessPayload,
  GetRecommendedInsurancesSuccessPayload,
  GetSetInsurancesEncouragementsForCartPayload,
  RecommendedInsuranceForCategory,
  RecommendedInsurancesForPaymentType,
} from '@ems/euro-mobile/cart/domain';
import {
  InsurancePaymentType,
  InsurancesOrServicesPrice,
} from '@ems/euro-mobile/shared/domain';
import {
  GetInsurancesEncouragementDetailsRequestParams,
  GetInsurancesRecommendedRequestParams,
  InsuranceCategory,
} from '@ems/shared/domain-openapi-contracts/insurances';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { CartIdFacade } from '../cart-id/cart-id-facade';
import { fromCartActions } from '../cart/cart.actions';
import { CartPartialState } from '../cart/cart.reducer';
import { cartQuery } from '../cart/cart.selectors';

@Injectable()
export class InsurancesFacade {
  recommendedInsurances$ = this.store.pipe(
    select(cartQuery.getRecommendedInsurances),
  );

  insurancesEncouragements$ = this.store.pipe(
    select(cartQuery.getInsurancesEncouragements),
  );

  insurancesForPopUp$ = this.store.pipe(
    select(cartQuery.getInsurancesForPopUp),
  );

  insurancesForPopUpLoaded$ = this.store.pipe(
    select(cartQuery.getInsurancesForPopUpLoaded),
  );

  redirectToCartPayload$ = this.store.pipe(
    select(cartQuery.getRedirectToCartPayload),
  );

  constructor(
    private readonly store: Store<CartPartialState>,
    private readonly cartIdFacade: CartIdFacade,
  ) {}

  getRecommendedInsurances(
    payload: GetInsurancesRecommendedRequestParams,
  ): void {
    this.store.dispatch(fromCartActions.getRecommendedInsurances({ payload }));
  }

  getInsurancesEncouragements(
    payload: GetInsurancesEncouragementDetailsRequestParams,
  ): void {
    this.store.dispatch(
      fromCartActions.getInsurancesEncouragements({ payload }),
    );
  }

  getProductInsurancesEncouragementsForSet(
    payload: GetSetInsurancesEncouragementsForCartPayload,
  ): void {
    this.store.dispatch(
      fromCartActions.getSetInsurancesEncouragementsForCart({ payload }),
    );
  }

  goToCart(
    payload: AddCartItemSuccessPayload | AddPackageSuccessPayload,
  ): void {
    this.store.dispatch(fromCartActions.redirectToCart({ payload }));
  }

  addInsuranceToCartItem(payload: AddInsuranceToCartItemPayload): void {
    this.store.dispatch(fromCartActions.addInsuranceToCartItem({ payload }));
  }

  addInsuranceToSet(payload: AddInsuranceToSetPayload): void {
    this.store.dispatch(fromCartActions.addInsuranceToSet({ payload }));
  }

  getInsurancePriceObject(
    insurance: RecommendedInsuranceForCategory,
    isInstalmentTabActive,
  ): Observable<InsurancesOrServicesPrice> {
    return this.insurancesEncouragements$.pipe(
      filter((res) => !!res),
      take(1),
      map((res) => {
        const insurancePeriodDescription =
          res.encouragementInsurancesForPaymentTypes
            .find(
              (forType) =>
                forType.paymentType === insurance.insurance.paymentType,
            )
            ?.encouragementInsurancesForCategories.find(
              (forCategory) => forCategory.category === insurance.category,
            )
            ?.insurances.find(
              (ins) => ins.id === insurance.insurance.id,
            )?.insurancePeriodDescription;

        if (isInstalmentTabActive && insurance.insurance.instalment) {
          return {
            price: insurance.insurance.instalment.instalmentPrice,
            numberOfInstalments:
              insurance.insurance.instalment.numberOfInstalments,
            loanInterest: insurance.insurance.instalment.loanInterest || 0,
            paymentType: InsurancePaymentType.Instalment,
            htmlDescription: insurancePeriodDescription,
          };
        }
        return {
          price: insurance.insurance.price,
          paymentType: insurance.insurance.paymentType,
          htmlDescription: insurancePeriodDescription,
        };
      }),
    );
  }

  getInsuranceIcon(insuranceCategory: InsuranceCategory): string {
    switch (insuranceCategory) {
      case 'BASIC_PROTECTION':
        return 'pg-basic';
      case 'FULL_PROTECTION':
        return 'pg-full';
      default:
        return 'pg-basic';
    }
  }

  initSortedRecommenedInsurances(
    recommendedInsurances: GetRecommendedInsurancesSuccessPayload,
    isInstalment = false,
  ): RecommendedInsuranceForCategory[] {
    return this.filterRecommendedInsurancesForPaymentTypes(
      recommendedInsurances.recommendedInsurancesForPaymentType,
      isInstalment
        ? [InsurancePaymentType.OneTime]
        : recommendedInsurances.paymentTypesDisplayOrder,
    );
  }

  handleInsurancePopUpClosed(data: {
    checkedId: number;
    paymentType: InsurancePaymentType;
  }): void {
    this.redirectToCartPayload$
      .pipe(
        filter((payload) => !!payload),
        take(1),
      )
      .subscribe((payload) => {
        if (data?.checkedId) {
          if ('productPlu' in payload) {
            this.addInsuranceToCartItem({
              productPlu: payload.productPlu,
              cartId: this.cartIdFacade.getCartId(),
              payload: {
                addedFrom: AddedItemFromType.ENCOURAGEMENT,
                insurance: {
                  insuranceId: data.checkedId,
                  insurancePaymentType: data.paymentType,
                },
              },
            });
          } else if ('dynamicSetAccessoriesIdentifier' in payload) {
            this.addInsuranceToSet({
              cartId: this.cartIdFacade.getCartId(),
              dynamicSetAccessoriesIdentifier:
                payload.dynamicSetAccessoriesIdentifier,
              payload: {
                addedFrom: AddedItemFromType.ENCOURAGEMENT,
                insurance: {
                  insuranceId: data.checkedId,
                  insurancePaymentType: data.paymentType,
                },
              },
            });
          }
          return;
        }

        this.goToCart(payload);
      });
  }

  private filterRecommendedInsurancesForPaymentTypes(
    recommendedInsurancesForPaymentType: RecommendedInsurancesForPaymentType[],
    paymentTypesDisplayOrder: InsurancePaymentType[],
  ): RecommendedInsuranceForCategory[] {
    const recommendedInsurancesForCategory = paymentTypesDisplayOrder
      .map((paymentTypeDisplayOrder) => {
        return (
          recommendedInsurancesForPaymentType.find(
            (insurance) => insurance.paymentType === paymentTypeDisplayOrder,
          )?.recommendedInsuranceForCategories || []
        );
      })
      .reduce((a, b) => {
        if (a.length) {
          return a;
        } else {
          return a.concat(...b);
        }
      });

    const maxDisplayedRecommendedInsurancesLength = 2;

    return recommendedInsurancesForCategory.slice(
      0,
      maxDisplayedRecommendedInsurancesLength,
    );
  }
}
