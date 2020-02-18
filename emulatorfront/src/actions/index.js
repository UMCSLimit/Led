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

export const modalChangeName = name => ({
  type: 'MODAL_CHANGE_NAME',
  name
})

export const modalChangeDesciption = description => ({
  type: 'MODAL_CHANGE_DESCRIPTIOM',
  description
})

export const modalSend = () => ({
  type: 'MODAL_SEND'
})

export const modalSent = () => ({
  type: 'MODAL_SENT'
})

export const modalShow = () => ({
  type: 'MODAL_SHOW'
})

export const modalHide = () => ({
  type: 'MODAL_HIDE'
})

// To do in redux
// Settings
// - running in redux
// - Live mode in redux
// - socket in redux
// - on run, clear list of console log
// - on run, clear last error

// - Update code in redux

// - None / UDP / USB Mode

// - Light / Dark mode in redux
// - Last error, or all errors in redux
// - Last console log, or all console.logs
