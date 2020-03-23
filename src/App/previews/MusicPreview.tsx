import React, { useEffect, useState } from 'react';

import { previewSlideRight } from 'animation';
import { KenBurns, LoadingIndicator } from 'components';
import { motion } from 'framer-motion';
import useSpotifyApi from 'hooks/useSpotifyApi';
import styled from 'styled-components';

const Container = styled(motion.div)`
  z-index: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const MusicPreview = () => {
  const [artworkUrls, setArtworkUrls] = useState<string[]>([]);
  const { loading, data, error } = useSpotifyApi<
    SpotifyApi.UsersSavedAlbumsResponse
  >("me/albums?limit=50");

  useEffect(() => {
    if (data?.items && !error) {
      setArtworkUrls(data.items.map(({ album }) => album.images[0].url));
    }
  }, [data, error]);

  return (
    <Container {...previewSlideRight}>
      {loading ? (
        <LoadingIndicator backgroundColor="linear-gradient(180deg, #B1B5C0 0%, #686E7A 100%)" />
      ) : (
        <KenBurns urls={artworkUrls} />
      )}
    </Container>
  );
};

export default MusicPreview;
