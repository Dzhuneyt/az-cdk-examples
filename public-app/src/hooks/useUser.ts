import { useEffect, useState } from 'react';
import { Auth, Hub } from 'aws-amplify';

export interface ISessionUser {
  loggedIn: boolean;
  userId: string;
  email: string;
}

export const newSessionUser = (): ISessionUser => ({
  loggedIn: false,
  userId: '',
  email: '',
});

export const useUser = (): ISessionUser => {
  const [user, setUser] = useState(newSessionUser());

  useEffect(() => {
    (async () => {
      try {
        const data = await Auth.currentAuthenticatedUser();
        if (data && data.attributes) {
          const { sub, email } = data.attributes;
          setUser({ loggedIn: true, userId: sub, email });
        }
      } catch (error) {
        /* do nothing */
      }
    })();

    const observer = (data: any) => {
      const { payload } = data;
      if (payload.event === 'signIn') {
        if (payload && payload.data && payload.data.attributes) {
          const { sub, email } = payload.data.attributes;
          setUser({ loggedIn: true, userId: sub, email });
        }
      }
      if (payload.event === 'signOut') {
        setUser(newSessionUser());
      }
    };

    Hub.listen('auth', observer);

    return () => Hub.remove('auth', observer);
  }, []);

  return user;
};
