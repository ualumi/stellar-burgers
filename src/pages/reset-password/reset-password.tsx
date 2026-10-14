import { resetPassword } from '@slices/userSlice';
import { ResetPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@services/store';

export const ResetPassword = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    setError(null);

    void dispatch(
      resetPassword({
        password,
        token,
      })
    )
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPassword');
        void navigate('/login', { replace: true });
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError
            : new Error('Не удалось изменить пароль')
        );
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
