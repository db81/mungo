import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { fillCollections, fillCollection } from 'actions'

let StoreState = connect(store => ({store}))(props =>
    <pre className="storeState">{JSON.stringify(props.store, null, 2)}</pre>)

export let Doc = ({doc}) =>
    <dl className="document">
        {Object.keys(doc).filter(k => k[0] !== '_').map(k => [
            <dt key={'t'+k}>{k}</dt>,
            <dd key={'d'+k}>{doc[k]}</dd>
        ])}
    </dl>

export let Index = connect(({ collections }) => ({ collections: Object.keys(collections) }))
(React.createClass({
    render: function(){
        return <div className="index">
            <h1>Mungo</h1>
            <h2>Collections</h2>
            {this.props.collections.map(col =>
                <Link
                    activeClassName="active"
                    key={col}
                    to={'/collections/' + col}>
                    {col}
                </Link>
            )}
            {this.props.children}
        </div>
    }
}))

export function View(props) {
    return <p>View {props.params.view}. <Link to="/">Back</Link>.</p>
}

export let Collection = connect(x => x, dispatch => ({ dispatch }),
    ({ collections }, d, { params: { collection } }) =>
        ({ ...d, collection: collections[collection], name: collection })
    )
(React.createClass({
    componentDidMount: function(){
        if (this.props.collection.stale)
            this.props.dispatch(fillCollection(this.props.name))
    },
    componentWillUpdate: function(nextProps){
        if (this.props.name !== nextProps.name && nextProps.collection.stale)
            this.props.dispatch(fillCollection(nextProps.name))
    },
    render: function(){
        return <div className="collection">
            {(this.props.collection.docs || []).map(d => <Doc key={d._id} doc={d} />)}
        </div>
    }
}))

export let AppRoutes =
    <Router history={browserHistory}>
        <Route path="/" component={Index}>
            <Route path="views/:view" component={View} />
            <Route path="collections/:collection" component={Collection} />
        </Route>
    </Router>
