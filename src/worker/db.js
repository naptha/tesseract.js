import leveljs from 'level-js'
var db = typeof indexedDB === 'undefined' ? { open: (_, cb) =>  cb(true) } : leveljs('./tessdata')
export default db