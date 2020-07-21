// Store/Reducers/Monreducer.js
const initialState = {
    destination: {
        latitude: 0,
        longitude: 0,
        nom: null
    }
}
function getDestination(state = initialState, action) {
    switch (action.type) {
        case 'TALENCE':
            return {
                destination: {
                    latitude: 44.808529,
                    longitude: -0.593583,
                    nom: 'Talence'
                }
            }
        case 'MONTAIGNE':
            return {
                destination: {
                    latitude: 44.795366,
                    longitude: -0.616307,
                    nom: 'Montaigne'
                }
            }
        case 'CARREIRE':
            return {
                destination: {
                    latitude: 44.825793,
                    longitude: -0.606012,
                    nom: 'Carreire'
                }
            }
        case 'VICTOIRE':
            return {
                destination: {
                    latitude: 44.831236,
                    longitude: -0.571001,
                    nom: 'Victoire'
                }
            }
        case 'GRADIGNAN':
            return {
                destination: {
                    latitude: 44.790805,
                    longitude: -0.607622,
                    nom: 'Gradignan'
                
                }
            }
        case 'BASTIDE':
            return {
                destination: {
                    latitude: 44.845049,
                    longitude: -0.557719,
                    nom: 'Bastide'
                }
            }
        default:
            return state
    }
}
export default getDestination