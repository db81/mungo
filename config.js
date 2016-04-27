import { readFileSync } from 'fs'

let config = {
    port: 8080,
    dbUrl: 'mongodb://localhost:27017/mungo',
    dbUser: 'mungo',
    dbPassword: ''
}
try {
    config = { ...config, ...JSON.parse(readFileSync('config.json')) }
} catch(err) {
    console.log('Failed to read config: ' + err.message)
}

export default config
