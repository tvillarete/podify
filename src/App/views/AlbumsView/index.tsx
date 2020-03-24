import React, { useCallback, useEffect, useState } from 'react';

import { SelectableList, SelectableListOption } from 'components';
import { useMenuHideWindow, useScrollHandler } from 'hooks';
import useSpotifyApi from 'hooks/useSpotifyApi';

import ViewOptions, { AlbumView } from '../';

const AlbumsView = () => {
  useMenuHideWindow(ViewOptions.albums.id);
  const [options, setOptions] = useState<SelectableListOption[]>([]);
  const [index] = useScrollHandler(ViewOptions.albums.id, options);
  const { loading, data, error } = useSpotifyApi<
    SpotifyApi.UsersSavedAlbumsResponse
  >("me/albums?limit=50");

  const handleData = useCallback(() => {
    setOptions(
      data!.items.map(item => ({
        label: item.album.name,
        value: () => <AlbumView name="Unused prop" id={item.album.id} />,
        image: item.album.images[0].url,
        viewId: ViewOptions.album.id
      }))
    );
  }, [data]);

  useEffect(() => {
    if (data?.items && !options.length && !error) {
      handleData();
    }
  }, [data, error, handleData, options]);

  return (
    <SelectableList loading={loading} options={options} activeIndex={index} />
  );
};

export default AlbumsView;
