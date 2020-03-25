import React, { useCallback, useEffect, useState } from 'react';

import { SelectableList, SelectableListOption } from 'components';
import { useMenuHideWindow, useScrollHandler } from 'hooks';
import useSpotifyApi from 'hooks/useSpotifyApi';

import ViewOptions from '../';
import PlaylistView from '../PlaylistView';

const PlaylistsView = () => {
  useMenuHideWindow(ViewOptions.playlists.id);
  const [options, setOptions] = useState<SelectableListOption[]>([]);
  const { loading, data, error } = useSpotifyApi<
    SpotifyApi.ListOfCurrentUsersPlaylistsResponse
  >("me/playlists?limit=50");

  const handleData = useCallback(() => {
    setOptions(
      data!.items.map(playlist => ({
        label: playlist.name,
        viewId: ViewOptions.playlist.id,
        value: () => (
          <PlaylistView
            name={playlist.name}
            id={playlist.id}
            userId={playlist.owner.id}
          />
        )
      }))
    );
  }, [data]);

  useEffect(() => {
    if (data?.items && !options.length && !error) {
      handleData();
    }
  }, [data, error, handleData, options.length]);

  const [index] = useScrollHandler(ViewOptions.playlists.id, options);

  return (
    <SelectableList loading={loading} options={options} activeIndex={index} />
  );
};

export default PlaylistsView;
