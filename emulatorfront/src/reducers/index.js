import { combineReducers } from 'redux';
import dmx from './dmx';
import editor from './editor';
import queue from './queue';

export default combineReducers({
  dmx,
  editor,
  queue
});