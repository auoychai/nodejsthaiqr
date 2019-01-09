var admin = require('firebase-admin');

var serviceAccount = require('./service-account.json');


const self = {

    app:admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL:''
    }),
}
module.exports = self;


