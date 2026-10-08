import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import {
  getIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '@slices/ingredientsSlice';
import { checkUserAuth } from '@slices/userSlice';
import { Preloader } from '@ui';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import { ProtectedRoute } from '@components/protected-route';
import { useAppDispatch, useAppSelector } from '@services/store';

import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isIngredientsLoading = useAppSelector(selectIngredientsLoading);
  const ingredientsError = useAppSelector(selectIngredientsError);

  const locationState = location.state as TLocationState | null;

  const backgroundLocation = locationState?.background;

  useEffect(() => {
    void dispatch(getIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseModal = (): void => {
    void navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation ?? location}>
        <Route
          path="/"
          element={
            isIngredientsLoading ? (
              <Preloader />
            ) : ingredientsError ? (
              <p className={clsx(styles.message, 'text text_type_main-medium')}>
                Не удалось загрузить ингредиенты
                {ingredientsError.message ? `: ${ingredientsError.message}` : '.'}
              </p>
            ) : (
              <ConstructorPage />
            )
          }
        />

        <Route path="/feed" element={<Feed />} />

        <Route path="/feed/:number" element={<OrderInfoPage />} />

        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfoPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path="/feed/:number"
            element={<OrderInfoModal onClose={handleCloseModal} />}
          />

          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderInfoModal onClose={handleCloseModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const IngredientDetailsPage = (): React.JSX.Element => (
  <main className={styles.detailPageWrap}>
    <h1 className={clsx(styles.detailHeader, 'text text_type_main-large')}>
      Детали ингредиента
    </h1>

    <IngredientDetails />
  </main>
);

const OrderInfoPage = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  return (
    <main className={styles.detailPageWrap}>
      <h1 className={clsx(styles.detailHeader, 'text text_type_digits-default')}>
        #{number}
      </h1>

      <OrderInfo />
    </main>
  );
};

type TOrderInfoModalProps = {
  onClose: () => void;
};

const OrderInfoModal = ({ onClose }: TOrderInfoModalProps): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  return (
    <Modal title={`#${number ?? ''}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

export default App;
