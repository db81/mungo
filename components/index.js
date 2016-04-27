import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { fillCollections, fillCollection } from 'actions'

let StoreState = connect(store => ({store}))(props => <pre>{JSON.stringify(props.store, null, 2)}</pre>)

export let Index = connect(({ collections }) => ({ collections: Object.keys(collections) }))
(React.createClass({
    render: function(){
        return <div>
            <h1>Mungo</h1>
            <div>{this.props.collections.map(col =>
                <Link key={col} to={'/collections/' + col}>{col}</Link>)}</div>
            <div>{this.props.children}</div>
            <StoreState />
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
    componentWillUpdate: function(nextProps){
        if (this.props.name !== nextProps.name && nextProps.collection.stale)
            this.props.dispatch(fillCollection(nextProps.name))
    },
    render: function(){
        return <div>
            {(this.props.collection.docs || []).map(d => <p key={d._id}>{JSON.stringify(d)}</p>)}
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
