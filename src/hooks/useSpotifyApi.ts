import { useState, useCallback } from "react";
import { useSpotifyService } from "services/spotify";

export interface SpotifyApiHook {
  getUser: () => Promise<SpotifyApi.CurrentUsersProfileResponse>;
}

const useSpotifyApi = (): SpotifyApiHook => {
  const { spotifyState, updateApiCache } = useSpotifyService();
  const { accessToken, apiCache } = spotifyState;

  const getUser = useCallback(async () => {
    if (apiCache.user) {
      return apiCache.user;
    }

    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
      json: true
    };

    const user: SpotifyApi.CurrentUsersProfileResponse = await (
      await fetch("https://api.spotify.com/v1/me", options)
    ).json();

    updateApiCache({ user });

    return user;
  }, []);

  return {
    getUser
  };
};

export default useSpotifyApi;
