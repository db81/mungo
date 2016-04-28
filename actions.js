import fetch from 'isomorphic-fetch'
import Config from 'config'

let apiPrefix = '/api'
if (Config) // running on server
    apiPrefix = `http://localhost:${Config.port}/api`

export function fillCollections() {
    return (dispatch) => {
        return fetch(apiPrefix + '/collections').then(res => res.json()).then(res => {
            dispatch({
                type: 'FILL_COLLECTIONS',
                collections: res,
            })
        })
    }
}

export function fillCollection(collection) {
    return (dispatch) => {
        return fetch(apiPrefix + '/collections/' + collection).then(res => res.json()).then(res => {
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

export function updateDocument(collection, doc) {
    return (dispatch) => {
        return fetch(`${apiPrefix}/collections/${collection}/${doc._id}`, {
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
