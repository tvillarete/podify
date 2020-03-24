import React, { useCallback, useEffect, useState } from 'react';

import { SelectableList, SelectableListOption } from 'components';
import { useMenuHideWindow, useScrollHandler } from 'hooks';
import useSpotifyApi from 'hooks/useSpotifyApi';

import ViewOptions, { ArtistView } from '../';

const ArtistsView = () => {
  useMenuHideWindow(ViewOptions.artists.id);
  const [options, setOptions] = useState<SelectableListOption[]>([]);
  const { loading, data, error } = useSpotifyApi<
    SpotifyApi.UsersFollowedArtistsResponse
  >("me/following?type=artist&limit=50");

  const handleData = useCallback(() => {
    setOptions(
      data!.artists.items.map(artist => ({
        label: artist.name,
        viewId: ViewOptions.artist.id,
        value: () => <ArtistView name={artist.name} id={artist.id} />
      }))
    );
  }, [data]);

  useEffect(() => {
    if (data?.artists.items && !options.length && !error) {
      handleData();
    }
  }, [data, error, handleData, options.length]);

  const [index] = useScrollHandler(ViewOptions.artists.id, options);

  return (
    <SelectableList loading={loading} options={options} activeIndex={index} />
  );
};

export default ArtistsView;
