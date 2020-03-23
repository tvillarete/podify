import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (data && !options.length) {
      setOptions(
        data!.tracks.items.map((track, index) => ({
          label: track.name,
          value: () => <NowPlayingView />,
          viewId: ViewOptions.nowPlaying.id,
          songIndex: index
        }))
      );
    }
  }, [data, options]);

  return (
    <SelectableList loading={loading} options={options} activeIndex={index} />
  );
};

export default AlbumView;
