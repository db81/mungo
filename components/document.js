import React from 'react'
import { findDOMNode } from 'react-dom'
import GrowingTextarea from 'react-autosize-textarea'
import { connectProps } from 'components/utils'
import { updateDocument } from 'actions'

let Doc = React.createClass({
    render: function(){
        return <dl className="document">
            {Object.keys(this.props.doc).filter(k => k[0] !== '_').map(k => [
                <dt key={'t'+k}>{k}</dt>,
                <dd key={'d'+k}>
                    <GrowingTextarea
                        ref={k}
                        style={{ resize: 'none' }}
                        defaultValue={this.props.doc[k]}
                        onChange={evt => this.props.onChange(k, evt)}
                    />
                </dd>
            ])}
        </dl>
    }
})

export let DocCollection = connectProps(({ collections }, { params: { collection, id } }) =>
    ({ collection, doc: collections[collection].docs[id] }))
(React.createClass({
    getInitialState: () => ({ updateTimeout: null }),
    componentWillUpdate: function(nextProps) {
        if (this.props.doc !== nextProps.doc && this.props.doc._id === nextProps.doc._id) {
            // Update persisted on server. Re-persist if the doc has changed locally since then.
            // This is not strictly necessary, but is kept as a fallback.
            let refs = this.refs.doc.refs
            if (!Object.keys(refs).every(k => findDOMNode(refs[k]).value == nextProps.doc[k]))
                this.persistDocument()
        }
    },
    handleUpdateDoc: function(field, evt) {
        this.persistDocument()
    },
    persistDocument: function() {
        let refs = this.refs.doc.refs
        let newDoc = Object.keys(refs).reduce((acc, k) =>
            ({ ...acc, [k]: findDOMNode(refs[k]).value }), {})

        if (this.state.updateTimeout)
            clearTimeout(this.state.updateTimeout)

        this.setState({ updateTimeout: setTimeout(() => {
            this.props.dispatch(updateDocument(this.props.collection,
                { _id: this.props.doc._id, ...newDoc })).then(() =>
                this.setState({ updateTimeout: null }))
        }, 1000) })
    },
    render: function(){
        // We set the key for the doc so that when we change docs it gets re-rendered
        // with new defaultValues for inputs. Otherwise the inputs will become stale.
        return <div className="docPane">
            <Doc
                ref="doc"
                key={this.props.doc._id}
                doc={this.props.doc}
                onChange={this.handleUpdateDoc}
            />
            {this.state.updateTimeout && <div className="saving">saving...</div>}
        </div>
    }
}))
