import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useInterval, useSpotifyWebPlaybackSdk } from 'hooks';
import { getTokens } from 'utils';

export interface SpotifyState {
  error?: string;
  loggedIn?: boolean;
  player?: Spotify.SpotifyPlayer;
  playerState?: Spotify.PlaybackState;
  deviceId?: string;
  accessToken?: string;
  refreshToken?: string;
}

type SpotifyContextType = [
  SpotifyState,
  React.Dispatch<React.SetStateAction<SpotifyState>>
];

const SpotifyContext = createContext<SpotifyContextType>([
  {
    accessToken: localStorage.getItem("spotify_access_token") ?? undefined
  },
  () => {}
]);

export interface SpotifyServiceHook {
  loggedIn: boolean;
  player?: Spotify.SpotifyPlayer;
  playerState?: Spotify.PlaybackState;
  deviceId?: string;
  accessToken?: string;
}

/**
 * This hook allows any component to access the Spotify client information:
 */
export const useSpotifyService = (): SpotifyServiceHook => {
  const [spotifyState] = useContext(SpotifyContext);
  const {
    loggedIn = false,
    player,
    playerState,
    deviceId,
    accessToken
  } = spotifyState;

  return {
    loggedIn,
    player,
    playerState,
    deviceId,
    accessToken
  };
};

interface Props {
  children: React.ReactChild;
}

const SpotifyProvider = ({ children }: Props) => {
  const [spotifyState, setSpotifyState] = useState<SpotifyState>({});

  const handlePlayerSetupCompletion = useCallback(
    (player: Spotify.SpotifyPlayer, deviceId: string) => {
      console.log("Player setup completed");
      setSpotifyState(prevState => ({
        ...prevState,
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

  /** Fetch access tokens and, if successful, then set up the playback sdk. */
  const handleMount = useCallback(async () => {
    const { accessToken, refreshToken } = await getTokens();

    setSpotifyState(prevState => ({
      ...prevState,
      loggedIn: !!accessToken,
      accessToken,
      refreshToken
    }));

    if (accessToken && refreshToken) {
      console.log("Setting up player.");
      setupPlayer();
    }
  }, [setupPlayer]);

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  /** Get a new access token every 50 minutes. */
  useInterval(async () => {
    getTokens();
  }, 50 * 60000);

  return (
    <SpotifyContext.Provider value={[spotifyState, setSpotifyState]}>
      {children}
    </SpotifyContext.Provider>
  );
};

export default memo(SpotifyProvider);
