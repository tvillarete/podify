import React, { useEffect, useState } from 'react';

import { LoadingIndicator } from 'components';
import useSpotifyApi from 'hooks/useSpotifyApi';
import styled from 'styled-components';

import CoverFlow from './CoverFlow';

const Container = styled.div`
  flex: 1;
`;

const CoverFlowView = () => {
  const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectFull[]>([]);

  const { loading, data, error } = useSpotifyApi<
    SpotifyApi.UsersSavedAlbumsResponse
  >("me/albums?limit=50");

  useEffect(() => {
    if (data?.items && !error && !albums.length) {
      setAlbums(data.items.map(({ album }) => album));
    }
  }, [albums.length, data, error]);

  return (
    <Container>
      {loading ? (
        <LoadingIndicator backgroundColor="white" />
      ) : (
        <CoverFlow albums={albums} />
      )}
    </Container>
  );
};

export default CoverFlowView;
