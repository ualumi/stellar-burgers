import { getFeeds, selectFeed, selectFeedOrders } from '@slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(selectFeedOrders);
  const feed = useAppSelector(selectFeed);

  const handleGetFeeds = (): void => {
    void dispatch(getFeeds());
  };

  useEffect(() => {
    void dispatch(getFeeds());
  }, [dispatch]);

  if (feed.isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
