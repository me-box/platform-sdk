import { WINDOW_RESIZED } from '../constants/ActionTypes';

export function windowResize(w,h) {
  return {
    type: WINDOW_RESIZED,
    w,
    h
  };
}