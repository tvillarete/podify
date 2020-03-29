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
  const { accessToken, deviceId, player, playerState } = useSpotifyService();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`
  };

  const play = useCallback(
    async (uris: string[], offset?: number) => {
      const currentTrackUri = playerState?.track_window.current_track.uri;
      const newTrackUri = uris[offset ?? 0];

      if (currentTrackUri !== newTrackUri) {
        await fetch(`${apiUrl}/play?device_id=${deviceId}`, {
          method: "PUT",
          body: JSON.stringify({ uris, offset: { position: offset ?? 0 } }),
          headers
        });
      }
    },
    [deviceId, headers, playerState]
  );

  const skipNext = useCallback(() => {
    if (player) {
      player.nextTrack();
    }
  }, [player]);

  const skipPrevious = useCallback(async () => {
    const curPlayerState = await player?.getCurrentState();
    const curTrackTime = curPlayerState?.position;

    /** If the track hasn't progressed at least 3 seconds,
     * restart it.
     */
    if (curTrackTime && curTrackTime < 3000) {
      player?.previousTrack();
    } else {
      player?.seek(0);
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
