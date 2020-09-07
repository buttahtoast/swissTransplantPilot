// Load modules
const fs = require("fs"),
  expressInit = require('./assets/express/index.js'),
  sqlite3 = require('sqlite3');

// Error Handling
if(!process.env.ACCESS_TOKEN) {
    console.error('Missing Environment ACCESS_TOKEN');
}

// Static App Configuration
const config = {
  accessToken: process.env.ACCESS_TOKEN,
  schema: {
    donator: "2wy7WKyfYL6z3HMZC7YxbM:3:CL:140610:default",
    relative: "2wy7WKyfYL6z3HMZC7YxbM:3:CL:140606:default"
  },
  web: {
    port: 8080,
    directory: __dirname + "/public"
  },
  db: 'relation.db'
}

// Database
const db = new sqlite3.Database(config.db);

// Load Webserver
async function initialize() {
  try {

    // Initialize Database
    db.run(`CREATE TABLE IF NOT EXISTS credential_connection(
      donator_credential VARCHAR(250),
      relative_credential VARCHAR(250),
      session VARCHAR(250))`
    );

    // Load Webserver
    console.log("Startup: Attempt to load Express App")
    const expressApp = await expressInit.initialize(config, db); // Initialize Express
    console.log("Startup: Loaded Express App")

    // Express Error Handler
    expressApp.on('error', function (err) {
      throw err; // Throw Critical Error
    })

    // Start Express Server
    expressApp.listen(config.web.port, "0.0.0.0", function() {
      console.log("Startup: Webserver running on Port " + config.web.port)
    });

  } catch(err) {
    console.error("Critical Error while setup: " + err);
  }
}
initialize();
