// Modules
const api = require('./api.js'),
  express = require('express'),
  bodyParser = require('body-parser'),
  http = require('http');

// Initalize Function (Loader)
function loader(config, db) {
  return new Promise(function(resolve, reject) {
    try {
      // App Constant
      const localapp = express();

      // Express Default Options
      localapp.use(express.static(config.web.directory)); // Define Public Directory
      localapp.use(bodyParser.json());  // Body json Encoding
      localapp.use(bodyParser.urlencoded({ extended: true })); // Url Encoding stage

      // Debug Output
      console.log("Startup: Attempt to load API Manifest");

      // Load Api Manifest
      api.definition(config, localapp, db).then((apiManifest) => {

        // Debug Output
        console.log("Startup: Received API Manifest");

        // Load HTTP Server
        app = http.createServer(apiManifest);

        // Debug Output
        console.log("Startup: HTTP Server Loaded");

        // Return Express with Api Definition
        resolve(app);

      }).catch(err => {
         // Throw Error
         throw(err);
      });
    } catch(err) {
      // Reject on Error
      reject(err);
    }
  });
}

// Export Module
module.exports.initialize = loader;
