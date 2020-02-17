import { UPDATE_DMX } from "../constants/action-types";

const initialState = {
  dmxValues: {}
}

const dmx = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_DMX:
        return {
          text: action.text,
        }
      case 'ZERO_DMX':
        return state;
      default:
        return state
    }
  }
  export default dmx