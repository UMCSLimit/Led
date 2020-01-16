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
