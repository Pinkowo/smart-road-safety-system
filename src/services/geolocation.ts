import {
  resetLocation,
  setGPSStatus,
  setLocationError,
  setPermissionGranted,
  updateLocation,
  type Coordinates,
} from '../store/locationSlice';
import type { AppDispatch } from '../store';
import type { GPSStatus } from '../types/settings';

export interface GeolocationServiceOptions {
  onLocationUpdate?: (coordinates: Coordinates) => void;
  onStatusChange?: (status: GPSStatus) => void;
  onError?: (error: Error) => void;
}

// 台北市政府座標
const TAIPEI_CITY_HALL: Coordinates = {
  latitude: 25.0330,
  longitude: 121.5654,
  accuracy: 10,
  heading: null,
  speed: null,
  timestamp: Date.now(),
};

export const createGeolocationService = (dispatch: AppDispatch) => {
  let isWatching = false;

  const emitStatus = (status: GPSStatus, options?: GeolocationServiceOptions) => {
    dispatch(setGPSStatus(status));
    options?.onStatusChange?.(status);
  };

  const startWatching = (options?: GeolocationServiceOptions) => {
    // 使用固定座標（台北市政府）作為預設位置，不請求瀏覽器定位
    dispatch(setPermissionGranted(true));
    dispatch(updateLocation({ ...TAIPEI_CITY_HALL, timestamp: Date.now() }));
    dispatch(setLocationError(undefined));
    emitStatus('active', options);
    options?.onLocationUpdate?.({ ...TAIPEI_CITY_HALL, timestamp: Date.now() });
    isWatching = true;
  };

  const stopWatching = () => {
    isWatching = false;
    dispatch(setGPSStatus('idle'));
  };

  const reset = () => {
    stopWatching();
    dispatch(resetLocation());
  };

  const getCurrentPosition = async (): Promise<Coordinates | undefined> => {
    return { ...TAIPEI_CITY_HALL, timestamp: Date.now() };
  };

  return {
    startWatching,
    stopWatching,
    reset,
    getCurrentPosition,
    isWatching: () => isWatching,
  };
};
