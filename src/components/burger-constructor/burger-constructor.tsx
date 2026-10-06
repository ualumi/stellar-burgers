import { clearConstructor, selectBurgerConstructor } from '@slices/constructorSlice';
import { getFeeds, getUserOrders } from '@slices/feedSlice';
import {
  closeOrderModal,
  createOrder,
  selectOrderModalData,
  selectOrderRequest,
} from '@slices/orderSlice';
import { selectUser } from '@slices/userSlice';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useAppSelector(selectBurgerConstructor);
  const orderRequest = useAppSelector(selectOrderRequest);
  const orderModalData = useAppSelector(selectOrderModalData);
  const user = useAppSelector(selectUser);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!user) {
      void navigate('/login', {
        state: {
          from: location,
        },
      });

      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredientIds)).then((action) => {
      if (createOrder.fulfilled.match(action)) {
        dispatch(clearConstructor());

        void dispatch(getFeeds());
        void dispatch(getUserOrders());
      }
    });
  };

  const handleCloseOrderModal = (): void => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
