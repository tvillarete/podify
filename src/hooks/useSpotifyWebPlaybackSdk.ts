import { useCallback, useEffect, useRef, useState } from 'react';

const noop = () => {};

interface Options {
  name: string;
  getOAuthToken: () => Promise<string>;
  accountError?: (e: unknown) => void;
  onReady?: (deviceId: string) => void;
  onPlayerStateChanged?: Spotify.PlaybackStateListener;
}

declare global {
  interface Window {
    Spotify: typeof Spotify;
  }
}

export function useSpotifyWebPlaybackSdk({
  name,
  getOAuthToken,
  accountError = noop,
  onReady = noop,
  onPlayerStateChanged = noop
}: Options) {
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const playerRef = useRef<Spotify.SpotifyPlayer | null>(null);

  useEffect(() => {
    if (window.Spotify) {
      playerRef.current = new Spotify.Player({
        name,
        getOAuthToken: async cb => {
          const token = await getOAuthToken();
          cb(token);
        }
      });
      setIsReady(true);
      playerRef.current.connect();
    }

    if (!window.Spotify) {
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://sdk.scdn.co/spotify-player.js";

      document.head!.appendChild(scriptTag);
    }
  }, [getOAuthToken, name]);

  const handleReady = useCallback(
    ({ device_id: readyDeviceId }) => {
      setDeviceId(readyDeviceId);

      if (onReady) {
        onReady(deviceId);
      }
    },
    [deviceId, onReady]
  );

  useEffect(() => {
    const player = playerRef.current!;
    if (isReady) {
      player.addListener("account_error", accountError);
      player.addListener("ready", handleReady);
      player.addListener("initialization_error", accountError);
      player.addListener("authentication_error", accountError);
      player.addListener("not_ready", accountError);
      player.addListener("player_state_changed", onPlayerStateChanged);

      return () => {
        player.removeListener("account_error", accountError);
        player.removeListener("ready", handleReady);
        player.removeListener("player_state_changed", onPlayerStateChanged);
      };
    }

    return;
  }, [accountError, handleReady, isReady, onPlayerStateChanged]);

  return {
    player: playerRef.current,
    deviceId,
    isReady
  };
}

export default useSpotifyWebPlaybackSdk;
