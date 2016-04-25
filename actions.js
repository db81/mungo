export function addDocument(collection, doc) {
    return {
        type: 'ADD_DOCUMENT',
        collection,
        doc
    }
}
