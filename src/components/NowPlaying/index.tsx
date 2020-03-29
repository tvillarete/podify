import React, { useCallback, useEffect, useState } from 'react';

import { Controls, Unit } from 'components';
import { useSpotifyService } from 'services/spotify';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`;

const MetadataContainer = styled.div`
  display: flex;
  height: 70%;
  padding: 0 ${Unit.XS};
`;

interface ArtworkContainerProps {
  isHidden?: boolean;
}

const ArtworkContainer = styled.div<ArtworkContainerProps>`
  height: 8em;
  width: 8em;
  margin: auto ${Unit.SM};
  -webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(70%, transparent), to(rgba(250, 250, 250, 0.1)));
  transform-style: preserve-3d;
  perspective: 500px;
  opacity: ${props => props.isHidden && 0};
`;

const Artwork = styled.img`
  height: 100%;
  width: 100%;
  transform: rotateY(18deg);
  border: 1px solid #f3f3f3;
`;

const InfoContainer = styled.div`
  flex: 1;
  margin: auto 0 auto ${Unit.XS};
`;

const Text = styled.h3`
  margin: 0;
  font-size: 0.92rem;
`;

const Subtext = styled(Text)`
  color: rgb(99, 101, 103);
  font-size: 0.75rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  height: 30%;
`;

interface Props {
  hideArtwork?: boolean;
  onHide: () => void;
}

const NowPlaying = ({ hideArtwork, onHide }: Props) => {
  const { playerState } = useSpotifyService();
  const [windowHidden, setWindowHidden] = useState(false);

  const currentTrack = playerState?.track_window.current_track;

  const handleWindowHide = useCallback(() => {
    if (!windowHidden) {
      onHide();
      setWindowHidden(true);
    }
  }, [onHide, windowHidden]);

  useEffect(() => {
    if (playerState && !playerState?.track_window.current_track) {
      handleWindowHide();
    }
  }, [handleWindowHide, playerState]);

  return currentTrack ? (
    <Container>
      <MetadataContainer>
        <ArtworkContainer isHidden={hideArtwork}>
          <Artwork src={currentTrack.album.images[0].url}></Artwork>
        </ArtworkContainer>
        <InfoContainer>
          <Text>{currentTrack.name}</Text>
          <Subtext>{currentTrack.artists[0].name}</Subtext>
          <Subtext>{currentTrack.album.name}</Subtext>
          {/* <Subtext>{`${songIndex + 1} of ${currentTrack.album.}`}</Subtext> */}
        </InfoContainer>
      </MetadataContainer>
      <ControlsContainer>
        <Controls />
      </ControlsContainer>
    </Container>
  ) : null;
};

export default NowPlaying;
