import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TFeedState, TOrder } from '@utils-types';

type TFeedStoreState = {
  feed: TFeedState;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  currentOrder: TOrder | null;
  orderInfoLoading: boolean;
  orderInfoError: string | null;
  error: string | null;
};

const initialState: TFeedStoreState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null,
  },
  userOrders: [],
  userOrdersLoading: false,
  currentOrder: null,
  orderInfoLoading: false,
  orderInfoError: null,
  error: null,
};

export const getFeeds = createAsyncThunk('feed/getFeeds', getFeedsApi);

export const getUserOrders = createAsyncThunk('feed/getUserOrders', getOrdersApi);

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number): Promise<TOrder> => {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.orderInfoLoading = false;
      state.orderInfoError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.feed.isLoading = true;
        state.feed.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.feed.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
        state.feed.isLoading = false;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.feed.isLoading = false;
        state.feed.error = action.error.message ?? 'Не удалось загрузить ленту';
      })

      .addCase(getUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.userOrdersLoading = false;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить историю заказов';
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.orderInfoLoading = true;
        state.currentOrder = null;
        state.orderInfoError = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.orderInfoLoading = false;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderInfoLoading = false;
        state.orderInfoError = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

type TFeedRootState = {
  feed: TFeedStoreState;
};

export const { clearCurrentOrder } = feedSlice.actions;

export const selectFeed = (state: TFeedRootState): TFeedState => state.feed.feed;

export const selectFeedOrders = (state: TFeedRootState): TOrder[] =>
  state.feed.feed.orders;

export const selectUserOrders = (state: TFeedRootState): TOrder[] =>
  state.feed.userOrders;

export const selectUserOrdersLoading = (state: TFeedRootState): boolean =>
  state.feed.userOrdersLoading;

export const selectCurrentOrder = (state: TFeedRootState): TOrder | null =>
  state.feed.currentOrder;

export const selectOrderInfoLoading = (state: TFeedRootState): boolean =>
  state.feed.orderInfoLoading;

export const selectOrderInfoError = (state: TFeedRootState): string | null =>
  state.feed.orderInfoError;

export const selectFeedError = (state: TFeedRootState): string | null =>
  state.feed.error;

export default feedSlice.reducer;
