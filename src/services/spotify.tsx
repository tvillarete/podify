import React, { createContext, useContext, useEffect, useState } from 'react';

interface SpotifyState {
  code?: string;
  state?: string;
  error?: string;
  loggedIn: boolean;
}

type SpotifyContextType = [
  SpotifyState,
  React.Dispatch<React.SetStateAction<SpotifyState>>
];

const SpotifyContext = createContext<SpotifyContextType>([
  {
    loggedIn: false
  },
  () => {}
]);

export interface SpotifyServiceHook {
  loggedIn: boolean;
}

/**
 * This hook allows any component to access the Spotify client information:
 */
export const useSpotifyService = (): SpotifyServiceHook => {
  const [spotifyState, setSpotifyState] = useContext(SpotifyContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code") || undefined;
    const state = urlParams.get("state") || undefined;

    setSpotifyState({
      loggedIn: !!code && !!state,
      code,
      state
    });
  }, [setSpotifyState]);

  return {
    loggedIn: spotifyState.loggedIn
  };
};

interface Props {
  children: React.ReactChild;
}

const SpotifyProvider = ({ children }: Props) => {
  const [spotifyState, setSpotifyState] = useState<SpotifyState>({
    loggedIn: false
  });

  return (
    <SpotifyContext.Provider value={[spotifyState, setSpotifyState]}>
      {children}
    </SpotifyContext.Provider>
  );
};

export default SpotifyProvider;
