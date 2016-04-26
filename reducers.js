import { combineReducers } from 'redux'

function docs(state = {}, action) {
    switch(action.type) {
    case 'ADD_DOCUMENT':
        return { [action.doc.id]: action.doc, ...state }
    default:
        return state
    }
}

function views(state = {}, action) {
    switch(action.type) {
    default:
        return state
    }
}

function collections(state = {}, action) {
    switch(action.type) {
    case 'ADD_DOCUMENT':
        return { [action.collection]: [...state[action.collection], action.doc.id] }
    default:
        return state
    }
}

export default combineReducers({ docs, views, collections })
