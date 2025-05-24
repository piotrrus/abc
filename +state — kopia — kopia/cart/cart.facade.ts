import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  AddCartItemPayload,
  AddedItemFromType,
  AddPackagePayload,
  AddServicePayload,
  CartProduct,
  DeleteServicePayload,
  DeliveryDate,
  ExcludedServices,
  GetServicesPayload,
  ItemCheapestPrice,
  ProductService,
  ServiceGroup,
  ShopLocation,
  UpdateDeliveryTimePayload,
  UpdateShopCodePayload,
  UpdateZipCodePayload,
} from '@ems/euro-mobile/cart/domain';
import { getCheapestPrice } from '@ems/euro-mobile/shared/util';
// eslint-disable-next-line
import { uriSuffix } from '@ems/shared/util';
// eslint-disable-next-line
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, startWith, take } from 'rxjs/operators';
import { CartSettingsFacade } from '../cart-settings/cart-settings.facade';
import { CartValidatorsFacade } from '../cart-validators/cart-validators.facade';
import { ServicesFacade } from '../services/services.facade';
import { fromCartActions } from './cart.actions';
import { CartPartialState } from './cart.reducer';
import { cartQuery } from './cart.selectors';
import { InsurancesOrServicesPrice } from '@ems/euro-mobile/shared/domain';
import { EuiCookbarService } from '@spektrum/addon-messages';

@Injectable()
export class CartFacade {
  cartItemCollection$ = this.store.pipe(
    select(cartQuery.getCartItemCollection),
  );
  cart$ = this.store.pipe(select(cartQuery.getCart));
  shop$ = this.store.pipe(select(cartQuery.getShop));
  cartItemsQuantity$ = this.store.pipe(select(cartQuery.getCartItemsQuantity));
  deliveryType$ = this.store.pipe(select(cartQuery.getDeliveryType));
  paymentType$ = this.store.pipe(select(cartQuery.getPaymentType));
  deliveryPrice$ = this.store.pipe(select(cartQuery.getDeliveryPrice));
  paymentPrice$ = this.store.pipe(select(cartQuery.getPaymentPrice));
  cartLoading$ = this.store.pipe(select(cartQuery.getCartLoading));
  cartLoadError$ = this.store.pipe(select(cartQuery.getCartLoadError));
  cartCreateError$ = this.store.pipe(select(cartQuery.getCartCreateError));
  cartCreating$ = this.store.pipe(select(cartQuery.getCartCreating));
  addCartItemLoading$ = this.store.pipe(
    select(cartQuery.getAddCartItemLoading),
  );
  addCartItemError$ = this.store.pipe(select(cartQuery.getAddCartItemError));
  removeCartItemLoading$ = this.store.pipe(
    select(cartQuery.getRemoveCartItemLoading),
  );
  removeCartItemError$ = this.store.pipe(
    select(cartQuery.getRemoveCartItemError),
  );
  cartValue$ = this.store.pipe(select(cartQuery.getCartValue));
  updatePaymentTypeLoading$ = this.store.pipe(
    select(cartQuery.getUpdatePaymentTypeLoading),
  );
  updatePaymentTypeError$ = this.store.pipe(
    select(cartQuery.getUpdatePaymentTypeError),
  );
  deliveryTimeCollection$ = this.store.pipe(
    select(cartQuery.getDeliveryTimeCollection),
  );
  deliveryTimeCollectionLoading$ = this.store.pipe(
    select(cartQuery.getDeliveryTimeCollectionLoading),
  );
  deliveryTimeCollectionError$ = this.store.pipe(
    select(cartQuery.getDeliveryTimeCollectionError),
  );
  deliveryTime$ = this.store.pipe(select(cartQuery.getDeliveryTime));
  finalDeliveryPrice$ = this.store.pipe(
    select(cartQuery.getFinalDeliveryPrice),
  );
  updateDeliveryTimeLoading = this.store.pipe(
    select(cartQuery.getUpdateDeliveryTimeLoading),
  );
  updateDeliveryTimeError = this.store.pipe(
    select(cartQuery.getUpdateDeliveryTimeError),
  );
  cartItems$ = this.store.pipe(select(cartQuery.getCartItems));

  zipCode$ = this.store.pipe(select(cartQuery.getZipCode));
  zipCodeLoading$ = this.store.pipe(select(cartQuery.getUpdateZipCodeLoading));
  zipCodeError$ = this.store.pipe(select(cartQuery.getUpdateZipCodeError));
  zipCodeSuggestion$ = this.store.pipe(select(cartQuery.getZipCodeSuggestion));
  zipCodePossibleCityCollection$ = this.store.pipe(
    select(cartQuery.getZipCodePossibleCityCollection),
  );
  locationError$ = this.store.pipe(select(cartQuery.getLocationError));

  services$ = this.servicesFacade.services$;

  constructor(
    private readonly store: Store<CartPartialState>,
    private readonly cartValidatorsFacade: CartValidatorsFacade,
    private readonly cookBarService: EuiCookbarService,
    private readonly cartSettingsFacade: CartSettingsFacade,
    private readonly servicesFacade: ServicesFacade,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  goToCart() {
    this.document.location.href = `/cart${uriSuffix}`;
  }

  getCartItems(): void {
    this.store.dispatch(fromCartActions.getCartItems());
  }

  addCartItem(payload: AddCartItemPayload): void {
    this.canAddCartItem(payload.identifiers.plu)
      .pipe(filter((canAddCartItem) => !!canAddCartItem))
      .subscribe(() => {
        this.store.dispatch(fromCartActions.addCartItem({ payload }));
      });
  }

  addPackage(payload: AddPackagePayload): void {
    this.canAddCartItem(payload.identifiers.plu)
      .pipe(filter((canAddCartItem) => !!canAddCartItem))
      .subscribe(() => {
        this.store.dispatch(fromCartActions.addPackage({ payload }));
      });
  }

  addAccessoryToCart(plu: string): void {
    this.canAddCartItem(plu)
      .pipe(filter((canAddCartItem) => !!canAddCartItem))
      .subscribe(() => {
        this.store.dispatch(
          fromCartActions.addCartItem({
            payload: {
              identifiers: {
                plu,
              },
              noRedirect: true,
              addedFrom: AddedItemFromType.PRODUCT_CARD,
            } as AddCartItemPayload,
          }),
        );
      });
  }

  updateShopCode(payload: UpdateShopCodePayload): void {
    this.store.dispatch(fromCartActions.updateShopCode({ payload }));
  }

  getDeliveryTimeCollection(): void {
    this.store.dispatch(fromCartActions.getDeliveryTimeCollection());
  }

  updateDeliveryTime(payload: UpdateDeliveryTimePayload): void {
    this.store.dispatch(fromCartActions.updateDeliveryTime({ payload }));
  }
  updateZipCode(payload: UpdateZipCodePayload): void {
    this.store.dispatch(fromCartActions.updateZipCode({ payload }));
  }

  getZipCodeFromCoordinates(): void {
    this.store.dispatch(fromCartActions.getZipCodeFromCoordinates());
  }

  clearZipCodeErrorsAndSuggestion(): void {
    this.store.dispatch(fromCartActions.clearZipCodeErrorsAndSuggestion());
  }

  clearZipCode(): void {
    this.store.dispatch(fromCartActions.clearZipCode());
  }

  getZipCodeFilteredPossibleCityCollection$(
    cityName: Observable<string>,
  ): Observable<ShopLocation[]> {
    return combineLatest([
      cityName.pipe(startWith('')),
      this.zipCodePossibleCityCollection$,
    ]).pipe(
      map(([cityName, cities]: [string, string[]]) =>
        cities
          .filter((city) => city.includes(cityName))
          .map((city) => ({ name: city })),
      ),
    );
  }

  getCheapestPriceForDeliveryTimeCollection$(): Observable<ItemCheapestPrice> {
    return this.deliveryTimeCollection$.pipe(
      map((deliveryTimeCollection: DeliveryDate[]) => {
        const prices = deliveryTimeCollection
          .map((deliveryDate) => {
            return getCheapestPrice(deliveryDate);
          })
          .filter((el) => typeof el !== 'undefined' && el !== null);
        return { price: Math.min(...prices, 0), from: prices.length !== 1 };
      }),
    );
  }

  getCheapestPriceForServiceGroup(
    serviceGroup: ServiceGroup,
  ): InsurancesOrServicesPrice {
    return this.servicesFacade.getCheapestPriceForServiceGroup(serviceGroup);
  }

  getServices(payload: GetServicesPayload): void {
    this.servicesFacade.getServices(payload);
  }

  getProductsServices$(): Observable<ProductService[]> {
    return this.cartItems$.pipe(
      map((cartItems: CartProduct[]) => {
        return cartItems.map((cartItem) => ({
          item: cartItem,
          services: cartItem.assignedServices || [],
        }));
      }),
    );
  }

  anyProductServices$(): Observable<boolean> {
    return this.getProductsServices$().pipe(
      map((products) =>
        products.some((product) => product.services.length > 0),
      ),
    );
  }

  addService(payload: AddServicePayload): void {
    this.servicesFacade.addService(payload);
  }

  deleteService(payload: DeleteServicePayload): void {
    this.servicesFacade.deleteService(payload);
  }

  getExcludedServices(): Observable<ExcludedServices> {
    return this.servicesFacade.getExcludedServices(this.cart$);
  }

  private canAddCartItem(plu: string): Observable<boolean> {
    return combineLatest([
      this.cartValidatorsFacade.isCartItemQuantityLimitAcquired$(plu),
      this.cartValidatorsFacade.isCartItemLimitAcquired$,
      this.cartSettingsFacade.getCartItemQuantityLimitError$,
      this.cartSettingsFacade.getCartItemLimitError$,
    ]).pipe(
      take(1),
      map(
        ([
          isCartItemQuantityLimitAcquired,
          isCartItemLimitAcquired,
          cartItemQuantityLimitError,
          cartItemLimitError,
        ]) => {
          if (isCartItemQuantityLimitAcquired || isCartItemLimitAcquired) {
            const errorMessage = isCartItemLimitAcquired
              ? cartItemLimitError
              : cartItemQuantityLimitError;
            this.cookBarService.show({
              title: 'Osiągnąłeś limit produktów na zamówienie',
              status: 'warning',
              content: errorMessage,
            });

            return false;
          }

          return true;
        },
      ),
    );
  }
}
