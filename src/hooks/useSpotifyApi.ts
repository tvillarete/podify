import { useFetch } from 'hooks';
import { useSpotifyService } from 'services/spotify';

export interface SpotifyApiHook<TType> {
  loading: boolean;
  data?: TType;
  error?: Error;
}

const useSpotifyApi = <TType>(
  endpoint: string,
  optionsOverride?: RequestInit
): SpotifyApiHook<TType> => {
  const { accessToken } = useSpotifyService();

  const shouldFetch = !!accessToken;

  const fetchOptions = {
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  };

  const { loading, data, error } = useFetch<TType>(
    `https://api.spotify.com/v1/${endpoint}`,
    {
      ...fetchOptions,
      ...optionsOverride
    },
    shouldFetch
  );

  return {
    loading,
    data,
    error
  };
};

export default useSpotifyApi;
