var google = require("googleapis");
const logger = require('../../config/winston');
// module.exports = {
const self = {

    getOAuth2Token:  ()=>{
        
        //var serviceAccount = require("../firebase/mywellform09-firebase-adminsdk-dz78o-dc4352256a.json");
        var serviceAccount = require('./esp2018-a347d-firebase-adminsdk-zorkn-112dde0e9d.json');

        // Define the required scopes.
        var scopes = [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/firebase.database",
          "https://www.googleapis.com/auth/firebase.messaging"
        ];
        // Authenticate a JWT client with the service account.
        var jwtClient = new google.google.auth.JWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key,
            scopes
          );


        return new Promise((resolve,reject)=>{

            jwtClient.authorize(function(error, tokens) {

                if (error) {
                    logger.debug("Error making request to generate access token:", error);
                    reject(error);

                } else if (tokens.access_token === null) {
                  logger.debug("Provided service account does not have permission to generate access tokens");
                    //resolve("Provided service account does not have permission to generate access tokens");
                    resolve(tokens);
                } else {
                  var accessToken = tokens.access_token;
              
                    resolve(tokens);
                  logger.debug("AccessToken:",accessToken);
                  // See the "Using the access token" section below for information
                  // on how to use the access token to send authenticated requests to
                  // the Realtime Database REST API.
                }
              });    
        });
      },
    }

    module.exports = self;