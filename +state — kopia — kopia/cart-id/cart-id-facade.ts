import { Injectable } from '@angular/core';
import { BrandService } from '@ems/shared/domain';
import { CookieService } from 'ngx-cookie-service';
import { CART_EURO_ID_COOKIE, CART_OLEOLE_ID_COOKIE } from './cart-id.config';

@Injectable()
export class CartIdFacade {
  constructor(
    private readonly cookieService: CookieService,
    private readonly brandService: BrandService
  ) {}

  getCartId(): string {
    return this.cookieService.get(
      this.brandService.isEuro() ? CART_EURO_ID_COOKIE : CART_OLEOLE_ID_COOKIE
    );
  }

  setCartId(cardId: string): void {
    return this.cookieService.set(
      this.brandService.isEuro() ? CART_EURO_ID_COOKIE : CART_OLEOLE_ID_COOKIE,
      cardId
    );
  }
}
