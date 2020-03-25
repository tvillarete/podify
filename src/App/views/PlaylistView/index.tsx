import React, { useEffect, useState } from 'react';

import ViewOptions from 'App/views';
import { SelectableList, SelectableListOption } from 'components';
import { useMenuHideWindow, useScrollHandler } from 'hooks';
import useSpotifyApi from 'hooks/useSpotifyApi';

import NowPlayingView from '../NowPlayingView';

interface Props {
  name: string;
  id?: string;
  userId?: string;
}

const PlaylistView = ({ name, id = "0", userId = "0" }: Props) => {
  useMenuHideWindow(ViewOptions.playlist.id);
  const [options, setOptions] = useState<SelectableListOption[]>([]);
  const [index] = useScrollHandler(ViewOptions.playlist.id, options);
  const { loading, data, error } = useSpotifyApi<
    SpotifyApi.PlaylistTrackResponse
  >(`users/${userId}/playlists/${id}/tracks`);

  useEffect(() => {
    if (data?.items && !error) {
      const trackUris = data.items.map(({ track }) => track.uri);

      setOptions(
        data.items.map((playlistItem, index) => ({
          label: playlistItem.track.name,
          value: () => <NowPlayingView />,
          viewId: ViewOptions.nowPlaying.id,
          image: playlistItem.track.album.images[0].url,
          songIndex: index,
          uris: trackUris
        }))
      );
    }
  }, [data, error]);

  return (
    <SelectableList loading={loading} options={options} activeIndex={index} />
  );
};

export default PlaylistView;
