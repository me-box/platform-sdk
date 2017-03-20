import React from 'react';
import { createDevTools } from 'redux-devtools';
import Perf from 'react-addons-perf'
// Monitors are separate packages, and you can make a custom one
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import SliderMonitor from 'redux-slider-monitor';

global.Perf = Perf;
// createDevTools takes a monitor and produces a DevTools component
export default createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h"
               changePositionKey="ctrl-q"
               changeMonitorKey="ctrl-m">
    <LogMonitor theme="nicinabox" />
    <SliderMonitor keyboardEnabled />
  </DockMonitor>
);