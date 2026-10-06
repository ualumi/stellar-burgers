import { selectIngredients, selectIngredientsLoading } from '@slices/ingredientsSlice';
import { IngredientDetailsUI, Preloader } from '@ui';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '@services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIngredientsLoading);

  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p className="text text_type_main-medium">Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
