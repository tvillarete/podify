import { useCallback } from 'react';

import { useSpotifyService } from 'services/spotify';

interface SpotifyPlayerHook {
  play: (uris: string[], offset?: number) => void;
}

const useSpotifyPlayer = (): SpotifyPlayerHook => {
  const { spotifyState } = useSpotifyService();
  const { accessToken, deviceId } = spotifyState;

  const play = useCallback(
    (uris: string[], offset?: number) => {
      console.log("Playing:", { uris });
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({ uris, offset: { position: offset ?? 0 } }),
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
