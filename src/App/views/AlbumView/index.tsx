import React, { useCallback, useEffect, useState } from 'react';

import ViewOptions, { NowPlayingView } from 'App/views';
import { SelectableList, SelectableListOption } from 'components';
import { useMenuHideWindow, useScrollHandler } from 'hooks';
import useSpotifyApi from 'hooks/useSpotifyApi';

interface Props {
  name: string;
  id?: string;
}

const AlbumView = ({ id = "0" }: Props) => {
  useMenuHideWindow(ViewOptions.album.id);
  const [options, setOptions] = useState<SelectableListOption[]>([]);
  const [index] = useScrollHandler(ViewOptions.album.id, options);
  const { loading, data } = useSpotifyApi<SpotifyApi.SingleAlbumResponse>(
    `albums/${id}`
  );

  const setupOptions = useCallback(() => {
    const trackUris = data!.tracks.items.map(({ uri }) => uri);

    setOptions(
      data!.tracks.items.map((track, index) => ({
        label: track.name,
        value: () => <NowPlayingView uri={track.uri} />,
        viewId: ViewOptions.nowPlaying.id,
        uris: trackUris,
        songIndex: index
      }))
    );
  }, [data]);

  useEffect(() => {
    if (data && !options.length) {
      setupOptions();
    }
  }, [data, options, setupOptions]);

  return (
    <SelectableList loading={loading} options={options} activeIndex={index} />
  );
};

export default AlbumView;
