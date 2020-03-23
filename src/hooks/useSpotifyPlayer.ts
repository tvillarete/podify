import { useCallback } from 'react';

import { useSpotifyService } from 'services/spotify';

interface SpotifyPlayerHook {
  play: (uri: string) => void;
}

const useSpotifyPlayer = (): SpotifyPlayerHook => {
  const { spotifyState, deviceId } = useSpotifyService();
  const { accessToken } = spotifyState;

  const play = useCallback(
    (uri: string) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });
    },
    [accessToken, deviceId]
  );

  return {
    play
  };
};

export default useSpotifyPlayer;
