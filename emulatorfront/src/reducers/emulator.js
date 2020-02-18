const initalState = {
    running: false,
    error: '',
    logs: [],
    liveMode: false
}
  
const emulator = (state = initalState, action) => {
    switch (action.type) {
        case 'EMULATOR_RUN':
            return Object.assign({}, state, { running: true, logs: [], error: '' });
        case 'EMULATOR_STOP':
            return Object.assign({}, state, { running: false });
        case 'EMULATOR_ERROR':
            return Object.assign({}, state, { error: action.error });
        case 'EMULATOR_LOG':
            return Object.assign({}, state, { logs: [...state.logs, action.log] });  
        case 'EMULATOR_LOG_RESET':
            return Object.assign({}, state, { logs: [] });
        case 'EMULATOR_LIVE_MODE_START':
            return Object.assign({}, state, { liveMode: true });
        case 'EMULATOR_LIVE_MODE_STOP':
            return Object.assign({}, state, { liveMode: false });
        case 'EMULATOR_LIVE_MODE':
            return Object.assign({}, state, { liveMode: !state.liveMode });
        default:
            return state
    }
}
export default emulator