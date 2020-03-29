import React from 'react';

import { motion } from 'framer-motion';
import { useSpotifyService } from 'services/spotify';
import styled from 'styled-components';

const Container = styled(motion.div)`
  height: 100%;
`;

const Artwork = styled.img`
  height: 100%;
  width: auto;
`;

const NowPlayingPreview = () => {
  const { playerState } = useSpotifyService();
  const artwork =
    playerState?.track_window?.current_track?.album?.images[0].url;

  return artwork ? (
    <Container>
      <Artwork src={artwork} alt="now playing artwork" />
    </Container>
  ) : null;
};

export default NowPlayingPreview;
