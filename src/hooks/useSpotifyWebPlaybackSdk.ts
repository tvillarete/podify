import { useCallback, useEffect, useRef, useState } from 'react';

import { getExistingTokens } from 'utils';

const noop = () => {};

interface Options {
  accountError?: (e: unknown) => void;
  onReady?: (deviceId: string) => void;
  onPlayerStateChanged?: Spotify.PlaybackStateListener;
  onPlayerSetupComplete: (
    player: Spotify.SpotifyPlayer,
    deviceId: string
  ) => void;
}

declare global {
  interface Window {
    Spotify: typeof Spotify;
  }
}

interface PlaybackSdkHook {
  setupPlayer: () => void;
  player: Spotify.SpotifyPlayer | null;
  deviceId: string;
  isReady: boolean;
}

export const useSpotifyWebPlaybackSdk = ({
  onPlayerSetupComplete,
  onPlayerStateChanged = noop
}: Options): PlaybackSdkHook => {
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [listenersMounted, setListenersMounted] = useState(false);
  const playerRef = useRef<Spotify.SpotifyPlayer | null>(null);

  /** When the SDK is attached to `window`, set up the player ref. */
  const handlePlayerSetup = useCallback(() => {
    playerRef.current = new Spotify.Player({
      name: "iPod Classic",
      getOAuthToken: async (cb: (token: string) => void) => {
        const { storedAccessToken } = getExistingTokens();

        if (!storedAccessToken) {
          console.error("ERROR: Didn't find stored access token");
          return;
        }

        cb(storedAccessToken);
      }
    });
    setIsReady(true);
    playerRef.current.connect();
  }, []);

  const handleReady = useCallback(
    ({ device_id: readyDeviceId }) => {
      setDeviceId(readyDeviceId);
      onPlayerSetupComplete(playerRef.current!, readyDeviceId);
    },
    [onPlayerSetupComplete]
  );

  const mountListeners = useCallback(() => {
    const player = playerRef.current!;

    player.addListener("account_error", noop);
    player.addListener("ready", handleReady);
    player.addListener("initialization_error", noop);
    player.addListener("authentication_error", noop);
    player.addListener("not_ready", noop);
    player.addListener("player_state_changed", playerState =>
      onPlayerStateChanged(playerState)
    );
    setListenersMounted(true);

    return () => {
      player.removeListener("account_error", noop);
      player.removeListener("ready", handleReady);
    };
  }, [handleReady, onPlayerStateChanged]);

  useEffect(() => {
    if (isReady && !listenersMounted) {
      mountListeners();
    }
  }, [isReady, listenersMounted, mountListeners]);

  const setupPlayer = useCallback(() => {
    if (window.Spotify) {
      handlePlayerSetup();
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => handlePlayerSetup();
    }
  }, [handlePlayerSetup]);

  return {
    setupPlayer,
    player: playerRef.current,
    deviceId,
    isReady
  };
};

export default useSpotifyWebPlaybackSdk;
