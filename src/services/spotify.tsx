import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useSpotifyWebPlaybackSdk } from 'hooks';

export interface SpotifyState {
  error?: string;
  loggedIn: boolean;
  player?: Spotify.SpotifyPlayer;
  playerState?: Spotify.PlaybackState;
  deviceId?: string;
  accessToken?: string;
  refreshToken?: string;
  mountingPlayer?: boolean;
}

type SpotifyContextType = [
  SpotifyState,
  React.Dispatch<React.SetStateAction<SpotifyState>>
];

const SpotifyContext = createContext<SpotifyContextType>([
  {
    loggedIn: false,
    accessToken: localStorage.getItem("spotify_access_token") ?? undefined
  },
  () => {}
]);

export interface SpotifyServiceHook {
  loggedIn: boolean;
  spotifyState: SpotifyState;
}

/**
 * This hook allows any component to access the Spotify client information:
 */
export const useSpotifyService = (): SpotifyServiceHook => {
  const [spotifyState, setSpotifyState] = useContext(SpotifyContext);

  const handlePlayerSetupCompletion = useCallback(
    (player: Spotify.SpotifyPlayer, deviceId: string) => {
      setSpotifyState(prevState => ({
        ...prevState,
        mountingPlayer: false,
        player,
        deviceId
      }));
    },
    [setSpotifyState]
  );

  const handlePlayerStateChange = useCallback(
    (playerState?: Spotify.PlaybackState) => {
      setSpotifyState(prevState => ({
        ...prevState,
        playerState
      }));
    },
    [setSpotifyState]
  );

  const { setupPlayer } = useSpotifyWebPlaybackSdk({
    onPlayerSetupComplete: handlePlayerSetupCompletion,
    onPlayerStateChanged: handlePlayerStateChange
  });

  useEffect(() => {
    if (!spotifyState.player && !spotifyState.mountingPlayer) {
      setupPlayer();
      setSpotifyState(prevState => ({
        ...prevState,
        mountingPlayer: true
      }));
    }
  }, [
    setSpotifyState,
    setupPlayer,
    spotifyState.mountingPlayer,
    spotifyState.player
  ]);

  const fetchToken = useCallback(
    async (code: string, state: string) => {
      try {
        const response = await fetch(
          `http://tannerv.ddns.net:3001/callback?state=${state}&code=${code}`,
          {
            credentials: "same-origin",
            mode: "cors"
          }
        );

        const { accessToken, refreshToken } = await response.json();

        localStorage.setItem("spotify_access_token", accessToken);
        localStorage.setItem("spotify_refresh_token", refreshToken);

        const today = new Date();

        localStorage.setItem(
          "spotify_expires_in",
          `${today.setHours(today.getHours() + 1)}`
        );

        setSpotifyState(prevState => ({
          ...prevState,
          loggedIn: true,
          accessToken,
          refreshToken
        }));
      } catch (error) {
        console.error("error fetching token:", { error });
      }
    },
    [setSpotifyState]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code") ?? "";
    const state = urlParams.get("state") ?? "";
    const storedToken = localStorage.getItem("spotify_access_token");

    if (storedToken) {
      setSpotifyState(prevState => ({
        ...prevState,
        loggedIn: true,
        accessToken: storedToken
      }));
    } else if (!!code && !!state) {
      document.cookie = `state=${state}`;

      fetchToken(code, state);
    }
  }, [fetchToken, setSpotifyState]);

  return {
    loggedIn: spotifyState.loggedIn,
    spotifyState
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

export default memo(SpotifyProvider);
