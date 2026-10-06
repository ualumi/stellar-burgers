import {
  clearCurrentOrder,
  getOrderByNumber,
  selectCurrentOrder,
  selectFeedOrders,
  selectOrderInfoError,
  selectOrderInfoLoading,
  selectUserOrders,
} from '@slices/feedSlice';
import { selectIngredients } from '@slices/ingredientsSlice';
import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/store';

import type { TIngredient, TOrder } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { number } = useParams<{ number: string }>();

  const ingredients = useAppSelector(selectIngredients);
  const feedOrders = useAppSelector(selectFeedOrders);
  const userOrders = useAppSelector(selectUserOrders);
  const currentOrder = useAppSelector(selectCurrentOrder);
  const isLoading = useAppSelector(selectOrderInfoLoading);
  const error = useAppSelector(selectOrderInfoError);

  const orderNumber = Number(number);

  const cachedOrder = useMemo<TOrder | null>(() => {
    if (!Number.isFinite(orderNumber)) {
      return null;
    }

    return (
      feedOrders.find((order) => order.number === orderNumber) ??
      userOrders.find((order) => order.number === orderNumber) ??
      null
    );
  }, [feedOrders, orderNumber, userOrders]);

  const orderData =
    cachedOrder ?? (currentOrder?.number === orderNumber ? currentOrder : null);

  useEffect(() => {
    if (Number.isFinite(orderNumber) && !cachedOrder) {
      void dispatch(getOrderByNumber(orderNumber));
    }

    return (): void => {
      dispatch(clearCurrentOrder());
    };
  }, [cachedOrder, dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (accumulator: TIngredientsWithCount, ingredientId) => {
        const existingIngredient = accumulator[ingredientId];

        if (existingIngredient) {
          existingIngredient.count++;
          return accumulator;
        }

        const ingredient = ingredients.find((item) => item._id === ingredientId);

        if (ingredient) {
          accumulator[ingredientId] = {
            ...ingredient,
            count: 1,
          };
        }

        return accumulator;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [ingredients, orderData]);

  if (!Number.isFinite(orderNumber)) {
    return <p className="text text_type_main-medium">Некорректный номер заказа</p>;
  }

  if (error) {
    return <p className="text text_type_main-medium">{error}</p>;
  }

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
