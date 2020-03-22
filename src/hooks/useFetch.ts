import { useCallback, useEffect, useState } from 'react';

export interface FetchHook<TType> {
  loading: boolean;
  data: TType;
  error: Error;
}

const useFetch = <TType>(
  url: string,
  options?: RequestInit,
  cachedVal?: any
) => {
  const [data, setData] = useState<TType>(cachedVal);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const handleFetch = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch(url, options);
      const json = await res.json();
      setData(json);
    } catch (error) {
      setError(new Error(error));
    } finally {
      setLoading(false);
    }
  }, [options, url]);

  useEffect(() => {
    if (!loading && !data && !error) {
      handleFetch();
    }
  }, [data, error, handleFetch, loading]);
  return { data, error, loading };
};

export default useFetch;
