import { loginUser, selectUserError } from '@slices/userSlice';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@services/store';

export const Login = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectUserError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(
      loginUser({
        email,
        password,
      })
    );
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
