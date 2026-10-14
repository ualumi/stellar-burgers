import { selectBurgerConstructor } from '@slices/constructorSlice';
import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';

import { useAppSelector } from '@services/store';

import type { TIngredientsCategoryProps } from './type';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  const burgerConstructor = useAppSelector(selectBurgerConstructor);

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    burgerConstructor.ingredients.forEach((ingredient) => {
      if (!counters[ingredient._id]) {
        counters[ingredient._id] = 0;
      }

      counters[ingredient._id]++;
    });

    if (burgerConstructor.bun) {
      counters[burgerConstructor.bun._id] = 2;
    }

    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
