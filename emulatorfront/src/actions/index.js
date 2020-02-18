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

export const emulatorRun = () => ({
  type: 'EMULATOR_RUN'
})

export const emulatorStop = () => ({
  type: 'EMULATOR_STOP'
})

export const emulatorError = (error) => ({
  type: 'EMULATOR_ERROR',
  error
})

export const emulatorLog = (log) => ({
  type: 'EMULATOR_LOG',
  log
})

export const emulatorResetLogs = () => ({
  type: 'EMULATOR_LOG_RESET'
})

export const emulatorStartLiveMode = () => ({
  type: 'EMULATOR_LIVE_MODE_START'
})

export const emulatorStopLiveMode = () => ({
  type: 'EMULATOR_LIVE_MODE_STOP'
})

export const emulatorLiveMode = () => ({
  type: 'EMULATOR_LIVE_MODE'
})

// To do in redux

// - socket in redux
// - add to redux if_electron
// - if_electron add to redux ipcRenderer
// - main ipc functions in redux 
// - Light / Dark mode