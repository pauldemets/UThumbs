// Store/Reducers/Monreducer.js
const initialState = {
    userName: null
}

function getUsername(state = initialState, action, username) {
    console.log(action.value);
    switch (action.type) {
        case 'setUsername':
            return {
                username: action.value
            }
        default:
            return state
    }
}
export default getUsername