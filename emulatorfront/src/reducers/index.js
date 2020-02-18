import { combineReducers } from 'redux';
import dmx from './dmx';
import editor from './editor';
import queue from './queue';
import modal from './modal';
import emulator from './emulator';

export default combineReducers({
  dmx,
  editor,
  queue,
  modal,
  emulator
});