import React, { useEffect, useState } from 'react';

import ViewOptions, { AlbumView } from 'App/views';
import { SelectableList, SelectableListOption } from 'components';
import { useMenuHideWindow, useScrollHandler } from 'hooks';
import useSpotifyApi from 'hooks/useSpotifyApi';

interface Props {
  name: string;
  id?: string;
}

const ArtistView = ({ name, id = "0" }: Props) => {
  useMenuHideWindow(ViewOptions.artist.id);
  const [options, setOptions] = useState<SelectableListOption[]>([]);
  const [index] = useScrollHandler(ViewOptions.artist.id, options);
  const { loading, data, error } = useSpotifyApi<
    SpotifyApi.ArtistsAlbumsResponse
  >(`artists/${id}/albums`);

  useEffect(() => {
    if (data?.items && !error) {
      setOptions(
        data.items.map(album => ({
          label: album.name,
          value: () => <AlbumView name={album.name} id={album.id} />,
          image: album.images[0].url,
          viewId: ViewOptions.album.id
        }))
      );
    }
  }, [data, error]);

  return (
    <SelectableList loading={loading} options={options} activeIndex={index} />
  );
};

export default ArtistView;
