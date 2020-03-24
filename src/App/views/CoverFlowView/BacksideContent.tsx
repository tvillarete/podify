import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { SelectableList, SelectableListOption } from 'components';
import { useEventListener, useScrollHandler } from 'hooks';
import styled from 'styled-components';

import ViewOptions from '../';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: -28%;
  bottom: -50%;
  left: -50%;
  right: -50%;
  border: 1px solid lightgray;
  background: white;
  transform: rotateY(180deg);
`;

const InfoContainer = styled.div`
  padding: 4px 8px;
  background: linear-gradient(180deg, #6585ad 0%, #789ab3 100%);
  border-bottom: 1px solid #6d87a3;
`;

const Text = styled.h3`
  font-size: 16px;
  margin: 0;
  color: white;
`;

const Subtext = styled(Text)`
  font-size: 14px;
`;

const ListContainer = styled.div`
  position: relative;
  flex: 1;
  overflow: auto;
`;

interface Props {
  album: SpotifyApi.AlbumObjectFull;
  setPlayingAlbum: (val: boolean) => void;
}

const BacksideContent = ({ album, setPlayingAlbum }: Props) => {
  const [options, setOptions] = useState<SelectableListOption[]>([]);
  const [index] = useScrollHandler(ViewOptions.coverFlow.id, options);

  useEventListener("centerclick", () => setPlayingAlbum(true));

  const handleData = useCallback(() => {
    const trackUris = album.tracks.items.map(({ uri }) => uri);

    setOptions(
      album.tracks.items.map((track, index) => ({
        label: track.name,
        value: track,
        songIndex: index,
        uris: trackUris
      }))
    );
  }, [album.tracks.items]);

  useEffect(() => {
    handleData();
  }, [handleData]);

  const artistNames = useMemo(
    () => album.artists.map(artist => artist.name).join(", "),
    [album.artists]
  );

  return (
    <Container>
      <InfoContainer>
        <Text>{album.name}</Text>
        <Subtext>{artistNames}</Subtext>
      </InfoContainer>
      <ListContainer>
        <SelectableList activeIndex={index} options={options} />
      </ListContainer>
    </Container>
  );
};

export default BacksideContent;
