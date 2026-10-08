import {
  getUserOrders,
  selectUserOrders,
  selectUserOrdersLoading,
} from '@slices/feedSlice';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(selectUserOrders);
  const isLoading = useAppSelector(selectUserOrdersLoading);

  useEffect(() => {
    void dispatch(getUserOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
