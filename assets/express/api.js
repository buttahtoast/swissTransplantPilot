//
// Requried Modules
//
const moment = require('moment');
const { CredentialsServiceClient: CredentialsServiceClient, Credentials } = require("@trinsic/service-clients");


// Cookie Donator / Relatives
var client,
  session = {
    donator: {
      connection: {},
      credential: {}
    },
    relative: {
      connection: {},
      credential: {}
    }
  };

// State Function


// Donator Ready
const connectionState = async function(connection) {
  if (connection.connectionId) {
    var connectionContract = await client.getConnection(connection.connectionId);
    // Check Connection State
    if (connectionContract.state == "Connected") {
      return { ready: true, connection: connectionContract }
    } else {
      return { ready: false, connection: connectionContract }
    }
  } else {
    return { ready: false, connection: connectionContract }
  }
}

async function loader(config, localapp) {
  return new Promise(async function(resolve, reject) {
     try {
       client = new CredentialsServiceClient(new Credentials(config.accessToken), { noRetryPolicy: true });

      //
      // Development
      //
         // Test Endpoint
         localapp.get('/api/test', function(req, res) {
            console.log(JSON.stringify(session))
            console.log(JSON.stringify(session.donator.credential))
         });

         // Create Invitation
         localapp.get('/api/invite/donator', async function(req, res) {
            // New Invitation Generation
            session.donator.connection = await client.createConnection({
                connectionInvitationParameters: {
                    multiParty: false
                }
            });

            // Return Invitation URL
            res.status(200).json({ url: session.donator.connection.invitationUrl, invitation: session.donator.connection.invitation, invitationQR: "https://chart.googleapis.com/chart?cht=qr&chl=" + session.donator.connection.invitationUrl + "&chs=200x200&chld=L|1" });
         });

         // Create Invitation
         localapp.get('/api/invite/relative', async function(req, res) {
            // New Invitation Generation
            session.relative.connection = await client.createConnection({
                connectionInvitationParameters: {
                    multiParty: false
                }
            });

            // Return Invitation URL
            res.status(200).json({ url: session.relative.connection.invitationUrl, invitation: session.relative.connection.invitation, invitationQR: "https://chart.googleapis.com/chart?cht=qr&chl=" + session.relative.connection.invitationUrl + "&chs=200x200&chld=L|1" });
         });

         // Check Invitation State
         localapp.get('/api/state/donator', async function(req, res) {
           var state = await connectionState(session.donator.connection)
           if (state.ready) {
             res.status(200).json({ ready: true });
           } else {
             res.status(200).json({ ready: false });
           }
         });

         // Check Invitation State
         localapp.get('/api/state/relative', async function(req, res) {
           var state = await connectionState(session.relative.connection)
           if (state.ready) {
             res.status(200).json({ ready: true });
           } else {
             res.status(200).json({ ready: false });
           }
         });

         // Issue Credential
         localapp.get('/api/issue/donator', async function(req, res) {
            stateD = await connectionState(session.donator.connection)
            stateR = await connectionState(session.relative.connection)
            if (stateD.ready && stateR.ready) {
               // Create Offer for Donator
               session.donator.credential = await client.createCredential({
                  definitionId: config.schema.donator,
                  connectionId: session.donator.connection.connectionId,
                  automaticIssuance: true,
                  credentialValues: {
                    donation: "true",
                    research: "true",
                    type: "all"
                  }

               });
            } else {
              console.log("Not Ready")
            }





         });


         // Resolve Api Manifest
         resolve(localapp);

     } catch(err) {
        reject(err);
     }
  });
}

// Export Module
module.exports.definition = loader;
