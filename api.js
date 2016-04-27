import { Router } from 'express'
import { MongoClient, ObjectID } from 'mongodb'
import BodyParser from 'body-parser'
import Config from 'config'

let router = Router()
let db = null

MongoClient.connect(Config.dbUrl, (err, db_) => {
    if (err) {
        console.log("Couldn't connect to database: " + err.message)
        process.exit(1)
    }
    db = db_
    db.authenticate(Config.dbUser, Config.dbPassword, (err, res) => {
        if (err || !res) {
            console.log("Failed database authentication: " + (err && err.message))
            process.exit(2)
        }
        console.log("Connected to database.")
    })
})

router.param('collection', (req, res, next, colname) => {
    db.collection(colname, { strict: true }, (err, result) => {
        if (err) {
            res.status(404).send(err.message)
        } else {
            req.collection = result
            next()
        }
    })
})

router.route('/collections/:collection/:id').
    get((req, res) => req.collection.find({ _id: ObjectID(req.params.id) }).next().
        then(result => result && res.json(result) || res.status(404).send('Document not found.')).
        catch(err => res.status(500).send(err.message)))

router.route('/collections/:collection').
    // TODO: pagination.
    get((req, res) => req.collection.find().toArray().then(result => res.json(result)).
        catch(err => res.status(500).send(err.message)))

router.route('/collections').
    get((req, res) => db.collections().then(cols => res.json(cols.map(c => c.collectionName))).
        catch(err => res.status(500).send(err.message)))

router.use('/query', BodyParser.text())
router.route('/query').
    post((req, res) => {

        // Use Function instead of eval to avoid exposing the local scope.
        let ret = new Function('db', 'ObjectID', `
            // Try to obtain at least a semblance of security by making known globals undefined.
            // https://nodejs.org/api/globals.html
            "use strict"
            let __dirname, __filename, console, exports, global, module, process, require
            let setImmediate, setInterval, setTimeout, clearImmediate, clearInterval, clearTimeout
            let Function, GeneratorFunction // otherwise you can do (new Function('process.exit()'))()
            ${req.body}
        `)(db, ObjectID)

        Promise.resolve(ret).then(result => res.json(result)).
            catch(err => res.status(500).send(err.message))
    })

export default router
