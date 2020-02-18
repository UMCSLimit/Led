const initalState = {
    name: '',
    desciption: '',
    sending: false,
    show: false,
}
  
const modal = (state = initalState, action) => {
    switch (action.type) {
        case 'MODAL_CHANGE_NAME':
            return Object.assign({}, state, { name: action.name });
        case 'MODAL_CHANGE_DESCRIPTIOM':
            return Object.assign({}, state, { desciption: action.desciption });
        case 'MODAL_SEND':
            return Object.assign({}, state, { sending: true });
        case 'MODAL_SENT':
            return Object.assign({}, state, { sending: false });
        case 'MODAL_SHOW':
            return Object.assign({}, state, { show: true });
        case 'MODAL_HIDE':
            return Object.assign({}, state, { show: false });
        default:
            return state
    }
}

export default modal