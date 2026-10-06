import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

type TMoveIngredientPayload = {
  fromIndex: number;
  toIndex: number;
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const constructorIngredient: TConstructorIngredient = {
        ...action.payload,
        id: nanoid(),
      };

      if (action.payload.type === 'bun') {
        state.bun = constructorIngredient;
        return;
      }

      state.ingredients.push(constructorIngredient);
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },

    moveIngredient: (state, action: PayloadAction<TMoveIngredientPayload>) => {
      const { fromIndex, toIndex } = action.payload;

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length ||
        fromIndex === toIndex
      ) {
        return;
      }

      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);

      if (movedIngredient) {
        state.ingredients.splice(toIndex, 0, movedIngredient);
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

type TConstructorRootState = {
  burgerConstructor: TConstructorState;
};

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;

export const selectBurgerConstructor = (
  state: TConstructorRootState
): TConstructorState => state.burgerConstructor;

export default constructorSlice.reducer;
