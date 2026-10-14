import { logoutUser } from '@slices/userSlice';
import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { useAppDispatch } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const handleLogout = (): void => {
    void dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
