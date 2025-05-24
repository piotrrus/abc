import { inject, Injectable } from '@angular/core';
import {
  AddServicePayload,
  Cart,
  DeleteServicePayload,
  ExcludedServices,
  GetServicesPayload,
  GetServicesSuccessPayload,
  ServiceDetails,
  ServiceGroup,
} from '@ems/euro-mobile/cart/domain';
import { DeliveryTypeEnum } from '@ems/euro-mobile/dictionary/domain';
import {
  InsurancePaymentType,
  InsurancesOrServicesPrice,
} from '@ems/euro-mobile/shared/domain';
import { select, Store } from '@ngrx/store';
import { tuiIsNumber } from '@taiga-ui/cdk';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromCartActions } from '../cart/cart.actions';
import { CartPartialState } from '../cart/cart.reducer';
import { cartQuery } from '../cart/cart.selectors';
import {
  FeatureFlagService,
  FeatureFlagType,
} from '@ems/shared/util-feature-flag';

@Injectable()
export class ServicesFacade {
  services$ = this.store.pipe(select(cartQuery.getServices));
  private readonly ffService = inject(FeatureFlagService);

  constructor(private readonly store: Store<CartPartialState>) {}

  getServices(payload: GetServicesPayload): void {
    this.store.dispatch(fromCartActions.getServices({ payload }));
  }

  getCheapestPriceForServiceGroup(
    serviceGroup: ServiceGroup,
    isInstalmentTabActive = false,
  ): InsurancesOrServicesPrice {
    const servicesPrices = serviceGroup.services.map((service) => {
      return {
        price: service.price,
        promotionalPrice: service.promotionalPrice,
      };
    });

    const promotionalPrices = servicesPrices
      .filter((s) => tuiIsNumber(s.promotionalPrice?.price))
      .map((s) => s.promotionalPrice);

    const basicPrices = servicesPrices.map((s) => s.price);

    const minPromo =
      promotionalPrices.length > 0 &&
      Math.min(...promotionalPrices.map((promotion) => promotion?.price));
    const minBasic = Math.min(...basicPrices);

    const allPrices = servicesPrices.map((servicePrice) => {
      if (tuiIsNumber(servicePrice.promotionalPrice?.price)) {
        return servicePrice.promotionalPrice?.price;
      }
      return servicePrice.price;
    });

    const from = new Set(allPrices).size > 1;

    const shouldPromoPriceBeVisible = minPromo < minBasic && !isNaN(minPromo);

    let minPromoFull;
    if (shouldPromoPriceBeVisible) {
      minPromoFull = promotionalPrices.find(
        (servicePrice) => servicePrice?.price === minPromo,
      );
    }

    return {
      price: minBasic,
      hasMultiplePrices: from,
      promotionalPrice: shouldPromoPriceBeVisible && minPromo,
      fromDatetime: minPromoFull?.fromDatetime,
      toDatetime: minPromoFull?.toDatetime,
      ...(isInstalmentTabActive && minBasic !== 0
        ? this.instalmentCheapestPriceForServiceGroup(serviceGroup.services)
        : {}),
    };
  }

  addService(payload: AddServicePayload): void {
    this.store.dispatch(fromCartActions.addService({ payload }));
  }

  deleteService(payload: DeleteServicePayload): void {
    this.store.dispatch(fromCartActions.deleteService({ payload }));
  }

  getExcludedServices(cart$: Observable<Cart>): Observable<ExcludedServices> {
    return combineLatest([cart$, this.services$]).pipe(
      map(([cart, services]) => {
        return this.getExcludedServicesByType(cart, services);
      }),
    );
  }

  isServiceGroupChecked(group: ServiceGroup): boolean {
    return group.services.some((service) => service.checked);
  }

  getCheckedItemsForServiceGroup(
    group: ServiceGroup,
    isInstalmentTabActive = false,
  ): InsurancesOrServicesPrice[] {
    return group.services
      .filter((service) => service.checked)
      .map((service) => ({
        name: service.name,
        price: service.price,
        promotionalPrice: service.promotionalPrice?.price,
        ...(isInstalmentTabActive ? this.mapServiceToInstalment(service) : {}),
      }));
  }

  getServiceIcon(group: ServiceGroup): string {
    // @todo
    return 'delivery-in-assembly-v-2';
  }

  private getExcludedServicesByType(
    cart: Cart,
    services: GetServicesSuccessPayload[],
  ) {
    const assignedServices = cart.products
      .map((product) => {
        return product.assignedServices;
      })
      .reduce((a, b) => a.concat(b), [])
      .map((productAssignedServices) => productAssignedServices.plu);

    const allServices = services
      .map((payload) =>
        payload.serviceGroups
          ?.map((group) => group.services)
          .reduce((a, b) => a.concat(b), []),
      )
      .reduce((a, b) => a.concat(b), []);

    const allServicesPlu = allServices
      .map((service) => service.servicePlu)
      .filter((service) => assignedServices.includes(service));

    const assignedServicesAsServiceDetails = allServices.filter((service) =>
      allServicesPlu.includes(service.servicePlu),
    );

    const servicesExcludedForHome = assignedServicesAsServiceDetails.filter(
      (s) =>
        s.deliveryTypeCodeExclusions
          .map((exclusion) => exclusion.deliveryName)
          .includes(DeliveryTypeEnum.HOME),
    );

    const servicesExcludedForShopReservation =
      assignedServicesAsServiceDetails.filter((service) =>
        service.deliveryTypeCodeExclusions
          .map((exclusion) => exclusion.deliveryName)
          .includes(DeliveryTypeEnum.SHOP_RESERVATION),
      );

    return {
      servicesExcludedForHome,
      servicesExcludedForShopReservation,
    };
  }

  private instalmentCheapestPriceForServiceGroup(
    services: ServiceDetails[],
  ): InsurancesOrServicesPrice {
    const service = services.reduce((lowest, service) => {
      return service.price < lowest.price ? service : lowest;
    }, services[0]);

    return this.mapServiceToInstalment(service);
  }

  private mapServiceToInstalment(
    service: ServiceDetails,
  ): InsurancesOrServicesPrice {
    // @todo Remove with FF EUROMO-3765
    if (!this.ffService.getFeature(FeatureFlagType._SERVICES_LOANS)) {
      return {} as InsurancesOrServicesPrice;
    }

    return {
      price: service.instalment.instalmentPrice,
      paymentType: InsurancePaymentType.Instalment,
      numberOfInstalments: service.instalment.numberOfInstalments,
      loanInterest: service.instalment.loanInterest,
      htmlDescription: service.instalment.warrantyTooltipMessage,
    };
  }
}
