import { useCallback } from 'react';

import { useAudioService } from 'services/audio';
import { useSpotifyService } from 'services/spotify';

interface SpotifyPlayerHook {
  play: (uris: string[], offset?: number) => void;
  skipNext: () => void;
  skipPrevious: () => void;
}

const apiUrl = "https://api.spotify.com/v1/me/player";

const useSpotifyPlayer = (): SpotifyPlayerHook => {
  const { spotifyState } = useSpotifyService();
  const { accessToken, deviceId, player } = spotifyState;
  const { setPlaying } = useAudioService();

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

      setPlaying(true, uris[offset ?? 0]);
    },
    [deviceId, headers, setPlaying]
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

  return {
    play,
    skipNext,
    skipPrevious
  };
};

export default useSpotifyPlayer;
