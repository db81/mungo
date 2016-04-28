import auth from 'http-auth'
import Config from 'config'

export default function(req, res, next) {
    if (req.get('X-Local-Access-Token') === global.localAccessToken || req.session.auth) {
        next()
    } else if (req.path === '/login') {
        auth.connect(auth.basic({ realm: 'Mungo' }, (name, pass, cb) =>
            cb(name === Config.siteUser && pass === Config.sitePassword)))(req, res, () => {
                req.session.auth = true
                res.redirect(302, req.query.to)
            })
    } else {
        res.redirect(302, '/login?to=' + encodeURIComponent(req.originalUrl))
    }
}
