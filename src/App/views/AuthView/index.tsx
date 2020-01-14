import React, { useEffect, useState } from 'react';

import ViewOptions, * as Views from 'App/views';
import { SelectableList, SelectableListOption } from 'components';
import { useScrollHandler } from 'hooks';
import { useSpotifyService } from 'services/spotify';
import { useWindowService } from 'services/window';

const AuthView = () => {
  const { loggedIn } = useSpotifyService();
  const { resetWindowStack } = useWindowService();

  useEffect(() => {
    if (loggedIn) {
      resetWindowStack({
        id: ViewOptions.home.id,
        type: Views.WINDOW_TYPE.SPLIT,
        component: Views.HomeView
      });
    }
  }, [loggedIn, resetWindowStack]);

  const initialOptions: SelectableListOption[] = [
    {
      label: "Spotify Signin",
      value: "hi",
      link: "localhost:8888/login"
    }
  ];

  const [options] = useState(initialOptions);
  const [index] = useScrollHandler(ViewOptions.auth.id, options);

  return <SelectableList options={options} activeIndex={index} />;
};

export default AuthView;
