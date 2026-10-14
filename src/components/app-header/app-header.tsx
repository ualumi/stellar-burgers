import { selectUser } from '@slices/userSlice';
import { AppHeaderUI } from '@ui';

import { useAppSelector } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useAppSelector(selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
