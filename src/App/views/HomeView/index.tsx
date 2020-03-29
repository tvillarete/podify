import React, { useCallback, useEffect, useState } from 'react';

import { PREVIEW } from 'App/previews';
import ViewOptions, {
  CoverFlowView,
  GamesView,
  MusicView,
  NowPlayingView,
  SettingsView,
} from 'App/views';
import { SelectableList, SelectableListOption } from 'components';
import { useScrollHandler } from 'hooks';
import { useSpotifyService } from 'services/spotify';

const strings = {
  nowPlaying: "Now Playing"
};

const HomeView = () => {
  const initialOptions: SelectableListOption[] = [
    {
      label: "Cover Flow",
      value: () => <CoverFlowView />,
      viewId: ViewOptions.coverFlow.id,
      preview: PREVIEW.MUSIC
    },
    {
      label: "Music",
      value: () => <MusicView />,
      viewId: ViewOptions.music.id,
      preview: PREVIEW.MUSIC
    },
    {
      label: "Games",
      value: () => <GamesView />,
      viewId: ViewOptions.games.id,
      preview: PREVIEW.GAMES
    },
    {
      label: "Settings",
      value: () => <SettingsView />,
      viewId: ViewOptions.settings.id,
      preview: PREVIEW.SETTINGS
    }
  ];

  const [options, setOptions] = useState(initialOptions);
  const [index] = useScrollHandler(ViewOptions.home.id, options);
  const { playerState } = useSpotifyService();
  const hasNowPlaying = playerState && !!playerState.track_window.current_track;

  /** Append the "Now Playing" button to the list of options. */
  const showNowPlaying = useCallback(() => {
    if (
      hasNowPlaying &&
      !options.find(option => option.label === strings.nowPlaying)
    ) {
      setOptions([
        ...options,
        {
          label: strings.nowPlaying,
          value: () => <NowPlayingView />,
          viewId: ViewOptions.nowPlaying.id,
          preview: PREVIEW.NOW_PLAYING
        }
      ]);
    }
  }, [options, hasNowPlaying]);

  /** Remove the "Now Playing" button from the list of options. */
  const hideNowPlaying = useCallback(() => {
    if (options.find(option => option.label === strings.nowPlaying)) {
      setOptions(options.filter(option => option.label !== strings.nowPlaying));
    }
  }, [options]);

  /** Conditionally show "Now Playing" button if music is queued/playing. */
  useEffect(() => {
    if (hasNowPlaying) {
      showNowPlaying();
    } else {
      hideNowPlaying();
    }
  }, [hideNowPlaying, showNowPlaying, hasNowPlaying]);

  return <SelectableList options={options} activeIndex={index} />;
};

export default HomeView;
