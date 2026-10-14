import ingredientsReducer, { getIngredients } from '@slices/ingredientsSlice';

import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png',
  },
  {
    _id: 'main-1',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 11,
    fat: 21,
    carbohydrates: 31,
    calories: 41,
    price: 200,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png',
  },
];

describe('ingredientsSlice reducer', () => {
  test('returns initial state for an unknown action', () => {
    const state = ingredientsReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  test('handles getIngredients.pending', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.pending('request-id', undefined)
    );

    expect(state.items).toEqual([]);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('handles getIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.fulfilled(mockIngredients, 'request-id', undefined)
    );

    expect(state.items).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('handles getIngredients.rejected', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.rejected(
        new Error('Ошибка загрузки ингредиентов'),
        'request-id',
        undefined
      )
    );

    expect(state.items).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error?.message).toBe('Ошибка загрузки ингредиентов');
  });
});
