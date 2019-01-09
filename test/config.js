module.exports = {
    name: 'API',
    version:0.1,
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 4001,
	base_url: process.env.BASE_URL || 'http://localhost:3000',
	db: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/api',
    },
    options:{
        // useMongoClient: true,
        autoIndex: false, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0
      }
};