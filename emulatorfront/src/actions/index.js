import { UPDATE_DMX } from "../constants/action-types";

export const updateDmx = text => {
  return {
    type: UPDATE_DMX,
    text: text 
  }
}

export const editorRun = () => ({
  type: 'EDITOR_RUN'
})

export const editorStop = () => ({
  type: 'EDITOR_STOP'
})

export const editorChange = code => ({
  type: 'EDITOR_CHANGE',
  code
})

export const queueChange = queue => ({
  type: 'QUEUE_CHANGE',
  queue
})

// To do in redux
// Queue
// - Get code from id
// - Get queue from axios
// Settings
// - socket in redux
// - running in redux
// - Live mode in redux
// - Update code in redux
// - None / UDP / USB Mode
// - Light / Dark mode in redux
// - Last error, or all errors in redux
// - Last console log, or all console.logs
// Modal
// - Show modal in redux
// - modalName and modalDescription