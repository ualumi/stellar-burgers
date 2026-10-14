import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from '@slices/constructorSlice';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockSecondBun: TIngredient = {
  ...mockBun,
  _id: 'bun-2',
  name: 'Вторая тестовая булка',
};

const mockMain: TIngredient = {
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
};

const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Тестовый соус',
  type: 'sauce',
  proteins: 12,
  fat: 22,
  carbohydrates: 32,
  calories: 42,
  price: 300,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png',
};

const constructorMain: TConstructorIngredient = {
  ...mockMain,
  id: 'constructor-main',
};

const constructorSauce: TConstructorIngredient = {
  ...mockSauce,
  id: 'constructor-sauce',
};

describe('burgerConstructor reducer', () => {
  test('returns initial state for an unknown action', () => {
    const state = constructorReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('adds a bun to the constructor', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));

    expect(state.bun).toEqual(expect.objectContaining(mockBun));
    expect(state.bun?.id).toEqual(expect.any(String));
    expect(state.ingredients).toEqual([]);
  });

  test('replaces previously selected bun', () => {
    const stateWithFirstBun = constructorReducer(undefined, addIngredient(mockBun));

    const stateWithSecondBun = constructorReducer(
      stateWithFirstBun,
      addIngredient(mockSecondBun)
    );

    expect(stateWithSecondBun.bun).toEqual(expect.objectContaining(mockSecondBun));
    expect(stateWithSecondBun.bun?._id).toBe('bun-2');
  });

  test('adds a filling to the constructor', () => {
    const state = constructorReducer(undefined, addIngredient(mockMain));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(expect.objectContaining(mockMain));
    expect(state.ingredients[0]?.id).toEqual(expect.any(String));
  });

  test('removes an ingredient from the constructor', () => {
    const initialState: TConstructorState = {
      bun: null,
      ingredients: [constructorMain, constructorSauce],
    };

    const state = constructorReducer(initialState, removeIngredient('constructor-main'));

    expect(state.ingredients).toEqual([constructorSauce]);
  });

  test('moves an ingredient inside the constructor', () => {
    const initialState: TConstructorState = {
      bun: null,
      ingredients: [constructorMain, constructorSauce],
    };

    const state = constructorReducer(
      initialState,
      moveIngredient({
        fromIndex: 0,
        toIndex: 1,
      })
    );

    expect(state.ingredients).toEqual([constructorSauce, constructorMain]);
  });

  test('does not move an ingredient when indexes are invalid', () => {
    const initialState: TConstructorState = {
      bun: null,
      ingredients: [constructorMain, constructorSauce],
    };

    const state = constructorReducer(
      initialState,
      moveIngredient({
        fromIndex: -1,
        toIndex: 1,
      })
    );

    expect(state).toEqual(initialState);
  });

  test('clears the constructor', () => {
    const initialState: TConstructorState = {
      bun: {
        ...mockBun,
        id: 'constructor-bun',
      },
      ingredients: [constructorMain, constructorSauce],
    };

    const state = constructorReducer(initialState, clearConstructor());

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
