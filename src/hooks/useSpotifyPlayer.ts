import { useCallback } from 'react';

import { useSpotifyService } from 'services/spotify';

interface SpotifyPlayerHook {
  play: (uris: string[], offset?: number) => void;
  togglePause: () => void;
  skipNext: () => void;
  skipPrevious: () => void;
}

const apiUrl = "https://api.spotify.com/v1/me/player";

const useSpotifyPlayer = (): SpotifyPlayerHook => {
  const { accessToken, deviceId, player } = useSpotifyService();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`
  };

  const play = useCallback(
    async (uris: string[], offset?: number) => {
      await fetch(`${apiUrl}/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({ uris, offset: { position: offset ?? 0 } }),
        headers
      });
    },
    [deviceId, headers]
  );

  const skipNext = useCallback(() => {
    if (player) {
      player.nextTrack();
    }
  }, [player]);

  const skipPrevious = useCallback(() => {
    if (player) {
      player.previousTrack();
    }
  }, [player]);

  const togglePause = useCallback(() => {
    if (player) {
      player.togglePlay();
    }
  }, [player]);

  return {
    play,
    togglePause,
    skipNext,
    skipPrevious
  };
};

export default useSpotifyPlayer;
