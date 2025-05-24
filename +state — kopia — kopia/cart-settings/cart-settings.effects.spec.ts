import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';
import { CartSettingsEffects } from './cart-settings.effects';
import { createSpyObj } from 'jest-createspyobj';
import { ApiError } from '@ems/shared/domain';
import { fromCartSettingsActions } from './cart-settings.actions';
import { CartRestriction, CartSettings } from '@ems/euro-mobile/cart/domain';
import { CartSettingsDataService } from '@ems/euro-mobile/cart/infrastructure';

describe('CartSettingsEffects', () => {
  let cartSettingsDataService: jest.Mocked<CartSettingsDataService>;
  let actions: Observable<unknown>;
  let effects: CartSettingsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartSettingsEffects,
        provideMockActions(() => actions),
        provideMockStore({ initialState: {} }),
        {
          provide: CartSettingsDataService,
          useValue: createSpyObj(CartSettingsDataService),
        },
      ],
    });

    effects = TestBed.inject(CartSettingsEffects);
    cartSettingsDataService = TestBed.inject(
      CartSettingsDataService
    ) as jest.Mocked<CartSettingsDataService>;
  });

  describe('getCartSettingsCartCollections', () => {
    const cartSettingsCollection = [
      {
        ruleID: CartRestriction.CART_ITEMS_LIMIT,
        value: 15,
        errorText: 'Przekroczyłeś maksymalną ilość różnych produktów w koszyku',
      },
      {
        ruleID: CartRestriction.CART_ITEM_QUANTITY_LIMIT,
        value: 2,
        errorText:
          'Przekroczyłeś maksymalną ilość produktów tego samego typu w koszyku',
      },
    ] as CartSettings[];

    test('returns GetCartSettingsCollection action on success', () => {
      const action = fromCartSettingsActions.getCartSettingsCollection();
      const completion =
        fromCartSettingsActions.getCartSettingsCollectionSuccess({
          payload: {
            cartSettingsCollection,
          },
        });

      actions = hot('-a', { a: action });
      const response = cold('--b|', { b: cartSettingsCollection });
      const expected = cold('---c', { c: completion });
      cartSettingsDataService.getCartSettingsCollection.mockReturnValue(
        response
      );

      expect(effects.getCartSettingsCollection$).toSatisfyOnFlush(() => {
        expect(
          cartSettingsDataService.getCartSettingsCollection
        ).toHaveBeenCalled();
      });
      expect(effects.getCartSettingsCollection$).toBeObservable(expected);
    });

    test('returns GetCartSettingsCollectionFail action on fail', () => {
      const action = fromCartSettingsActions.getCartSettingsCollection();
      const completion = fromCartSettingsActions.getCartSettingsCollectionFail({
        payload: {
          error: {} as ApiError,
        },
      });

      actions = hot('-a', { a: action });
      const response = cold('-#', {}, {});
      const expected = cold('--c', { c: completion });
      cartSettingsDataService.getCartSettingsCollection.mockReturnValue(
        response
      );

      expect(effects.getCartSettingsCollection$).toSatisfyOnFlush(() => {
        expect(
          cartSettingsDataService.getCartSettingsCollection
        ).toHaveBeenCalled();
      });
      expect(effects.getCartSettingsCollection$).toBeObservable(expected);
    });
  });
});
