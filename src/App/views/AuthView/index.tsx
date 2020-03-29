import React, { useCallback, useEffect, useState } from 'react';

import ViewOptions, * as Views from 'App/views';
import { SelectableList, SelectableListOption } from 'components';
import { useScrollHandler } from 'hooks';
import { useSpotifyService } from 'services/spotify';
import { useWindowService } from 'services/window';
import { isDev } from 'utils';

const initialOptions: SelectableListOption[] = [
  {
    label: "Spotify Signin",
    value: "hi",
    link: `http://tannerv.ddns.net:3001/${isDev ? "login_dev" : "login"}`
  }
];

const AuthView = () => {
  const { resetWindowStack } = useWindowService();
  const [options] = useState(initialOptions);
  const [index] = useScrollHandler(ViewOptions.auth.id, options);
  const { loggedIn } = useSpotifyService();

  const handleCheckLogin = useCallback(() => {
    if (loggedIn) {
      resetWindowStack({
        id: ViewOptions.home.id,
        type: Views.WINDOW_TYPE.SPLIT,
        component: Views.HomeView
      });
    }
  }, [loggedIn, resetWindowStack]);

  useEffect(() => {
    handleCheckLogin();
  }, [handleCheckLogin]);

  return <SelectableList options={options} activeIndex={index} />;
};

export default AuthView;
