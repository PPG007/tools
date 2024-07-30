import { getPreciseDistance } from 'geolib';

interface QueryParam {
  [key: string]: string;
}

export const getQueryParams = () => {
  const pairs = window.location.search.substring(1).split('&');
  const params: QueryParam = {};
  pairs.forEach((pair) => {
    const temp = pair.split('=');
    if (temp.length !== 2) {
      return;
    }
    params[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
  });
  return params;
};

export const getQueryParam = (name: string) => {
  const params = getQueryParams();
  if (params[name]) {
    return params[name];
  }
  return '';
};

export const refreshQuery = (params: QueryParam) => {
  const current = new URL(window.location.toString());
  Object.keys(params).forEach((key) => {
    current.searchParams.set(key, params[key]);
  });
  window.history.replaceState({}, '', current);
};

export const encodeHttpURL = (url: string) => {
  return encodeURIComponent(url);
};

export const decodeHttpURL = (url: string) => {
  return decodeURIComponent(url);
};

export const copyToClipboard = (content: string) => {
  return navigator.clipboard.writeText(content);
};

export interface PointCoordinates {
  lat: number;
  lng: number;
}

export const getPointDistance = (from: PointCoordinates, to: PointCoordinates): number => {
  return getPreciseDistance(
    {latitude: from.lat, longitude: from.lng},
    {latitude: to.lat, longitude: to.lng},
  );
};

export const getArrayByLength = (length: number): Array<number> => {
  return Array.from({length}, (_, i) => i);
};