import { WINDOW_RESIZE } from '../constants/ActionTypes';

export function windowResize(w,h) {
  return {
    type: WINDOW_RESIZE,
    w,
    h
  };
}