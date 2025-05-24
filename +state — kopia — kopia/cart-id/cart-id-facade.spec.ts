import { TestBed } from '@angular/core/testing';
import { Brand, BrandService } from '@ems/shared/domain';
import { MockBrandService } from '@ems/shared/test-utils/common';
import { MockProvider } from 'ng-mocks';
import { CookieService } from 'ngx-cookie-service';
import { CartIdFacade } from './cart-id-facade';
import { CART_EURO_ID_COOKIE, CART_OLEOLE_ID_COOKIE } from './cart-id.config';

const MOCK_CART_ID = 'mock-cart-id';

describe('DateService', () => {
  let cartIdFacade: CartIdFacade;
  let cookieName: string;
  let cookieValue: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CartIdFacade,
        MockProvider(CookieService, {
          set: (name: string, value: string) => {
            cookieName = name;
            cookieValue = value;
          },
          get: (name: string) => `cart-id-for-${name}`,
        }),
        {
          provide: BrandService,
          useValue: new MockBrandService(Brand.EURO),
        },
      ],
    });
  });

  it('should be created', () => {
    cartIdFacade = TestBed.inject(CartIdFacade);
    expect(cartIdFacade).toBeTruthy();
  });

  it('should set cartId for Euro', () => {
    cartIdFacade = TestBed.inject(CartIdFacade);
    const euroCartId = `${MOCK_CART_ID}-euro`;
    cartIdFacade.setCartId(euroCartId);

    expect(cookieName).toBe(CART_EURO_ID_COOKIE);
    expect(cookieValue).toBe(euroCartId);
  });

  it('should set cartId for OleOle', () => {
    TestBed.overrideProvider(BrandService, {
      useValue: new MockBrandService(Brand.OLEOLE),
    });
    cartIdFacade = TestBed.inject(CartIdFacade);
    const oleoleCartId = `${MOCK_CART_ID}-oleole`;
    cartIdFacade.setCartId(oleoleCartId);

    expect(cookieName).toBe(CART_OLEOLE_ID_COOKIE);
    expect(cookieValue).toBe(oleoleCartId);
  });

  it('should get cartId for Euro', () => {
    cartIdFacade = TestBed.inject(CartIdFacade);
    const cartId: string = cartIdFacade.getCartId();
    expect(cartId).toBe(`cart-id-for-${CART_EURO_ID_COOKIE}`);
  });

  it('should get cartId for Euro', () => {
    TestBed.overrideProvider(BrandService, {
      useValue: new MockBrandService(Brand.OLEOLE),
    });
    cartIdFacade = TestBed.inject(CartIdFacade);
    const cartId: string = cartIdFacade.getCartId();
    expect(cartId).toBe(`cart-id-for-${CART_OLEOLE_ID_COOKIE}`);
  });
});
