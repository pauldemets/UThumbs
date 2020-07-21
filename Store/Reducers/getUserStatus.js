// Store/Reducers/Monreducer.js
const initialState = {
    userStatus : null
}

function getUserStatus(state = initialState, action) {
    switch (action.type) {
        case 'DRIVER':
            return {
                userStatus : "driver"
            }
        case 'PEDESTRIAN':
            return {
                userStatus : "pedestrian"
            }
        default:
            return state
    }
}
export default getUserStatus