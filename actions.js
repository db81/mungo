import isoFetch from 'isomorphic-fetch'
import Config from 'config'

let fetch
if (Config) { // running on server
    fetch = (path, { ...params, headers } = {}) =>
        isoFetch(`${Config.enableHttps ? 'https' : 'http'}://localhost:${Config.port}/api/${path}`,
        { ...params, headers: { ...headers, 'X-Local-Access-Token': global.localAccessToken } })
} else {
    fetch = (path, params) => isoFetch('/api/' + path, { credentials: 'same-origin', ...params })
}

export function fillCollections() {
    return (dispatch) => {
        return fetch('collections').then(res => res.json()).then(res => {
            dispatch({
                type: 'FILL_COLLECTIONS',
                collections: res,
            })
        })
    }
}

export function fillCollection(collection) {
    return (dispatch) => {
        return fetch('collections/' + collection).then(res => res.json()).then(res => {
            dispatch({
                type: 'FILL_COLLECTION',
                collection,
                docs: res
            })
        })
    }
}

export function fillView(view) {
}

export function invalidateCollection(collection) {
    return {
        type: 'INVALIDATE_COLLECTION',
        collection
    }
}

export function addDocument(collection, doc) {
    return (dispatch) => {
        return fetch('collections/' + collection, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...doc, _id: undefined })
        }).then(res => res.json()).then(res => {
            dispatch({
                type: 'ADD_DOCUMENT',
                collection,
                doc: res
            })
        })
    }
}

export function updateDocument(collection, doc) {
    return (dispatch) => {
        return fetch(`collections/${collection}/${doc._id}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...doc, _id: undefined })
        }).then(res => res.json()).then(res => {
            dispatch({
                type: 'UPDATE_DOCUMENT',
                collection,
                doc: res
            })
        })
    }
}
