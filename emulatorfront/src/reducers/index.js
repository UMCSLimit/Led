import { combineReducers } from 'redux';
import dmx from './dmx';
import editor from './editor';

export default combineReducers({
  dmx,
  editor
});