import { useFetch } from 'hooks';
import { ApiCache, useSpotifyService } from 'services/spotify';

export interface SpotifyApiHook<TType> {
  loading: boolean;
  data?: TType;
  error?: Error;
}

const useSpotifyApi = <TType>(
  endpoint: string,
  cacheKey?: keyof ApiCache,
  optionsOverride?: RequestInit
): SpotifyApiHook<TType> => {
  const { spotifyState } = useSpotifyService();
  const { accessToken } = spotifyState;

  const fetchOptions = {
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  };

  const { loading, data, error } = useFetch<TType>(
    `https://api.spotify.com/v1/${endpoint}`,
    {
      ...fetchOptions,
      ...optionsOverride
    }
  );

  return {
    loading,
    data,
    error
  };
};

export default useSpotifyApi;
