import { useCallback, useEffect, useRef, useState } from 'react';

import { useSpotifyService } from 'services/spotify';

import useEventListener from './useEventListener';

interface VolumeHandlerHook {
  volume: number;
  active: boolean;
  setEnabled: (val: boolean) => void;
}

const useVolumeHandler = (): VolumeHandlerHook => {
  const [active, setActive] = useState(false);
  const [volume, setVolume] = useState(100);
  const [enabled, setIsEnabled] = useState(true);
  const timeoutIdRef = useRef<any>();
  const { player } = useSpotifyService();

  const handleMount = useCallback(async () => {
    const currentVolume = ((await player?.getVolume()) ?? 0) * 100;

    setVolume(currentVolume);
  }, [player]);

  useEffect(() => {
    handleMount();

    /** clear the timeout to prevent memory leaks. */
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [handleMount]);

  /** This is used to disable and reset the "active" timeout. */
  const setEnabled = useCallback((val: boolean) => {
    if (!val && timeoutIdRef.current) {
      setActive(false);
      setIsEnabled(false);
      clearTimeout(timeoutIdRef.current);
    } else {
      setActive(false);
      setIsEnabled(true);
      clearTimeout(timeoutIdRef.current);
    }
  }, []);

  /** The volume bar is "active" for 3 seconds after the last volume update. */
  const setActiveState = useCallback(() => {
    if (!enabled) return;

    setActive(true);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      setActive(false);
    }, 3000);
  }, [enabled]);

  const increaseVolume = useCallback(async () => {
    setActiveState();
    if (volume === 100 || !enabled) return;

    player?.setVolume((volume + 4) / 100);
    setVolume(volume + 4);
  }, [enabled, player, setActiveState, volume]);

  const decreaseVolume = useCallback(() => {
    setActiveState();
    if (volume === 0 || !enabled) return;

    player?.setVolume((volume - 4) / 100);
    setVolume(volume - 4);
  }, [setActiveState, volume, enabled, player]);

  useEventListener("forwardscroll", increaseVolume);
  useEventListener("backwardscroll", decreaseVolume);
  /** Don't mistake a scroll for a click. */
  useEventListener("wheelclick", () => setActive(false));

  return {
    setEnabled,
    volume,
    active
  };
};

export default useVolumeHandler;
