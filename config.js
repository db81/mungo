import { readFileSync } from 'fs'

let config = {
    host: '',
    port: 8080,
    dbUrl: 'mongodb://localhost:27017/mungo',
    dbUser: 'mungo',
    dbPassword: '',
    siteUser: 'admin',
    sitePassword: '',
    // Run with NODE_TLS_REJECT_UNAUTHORIZED=0 if your cert is self-signed. To generate one:
    // openssl req -x509 -nodes -sha256 -days 3650 -newkey rsa:2048 -keyout key.pem -out cert.pem
    enableHttps: false, 
    keyFile: 'key.pem',
    certFile: 'cert.pem'
}
try {
    config = { ...config, ...JSON.parse(readFileSync('config.json')) }
} catch(err) {
    console.log('Failed to read config: ' + err.message)
}

export default config
