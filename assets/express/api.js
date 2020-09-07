//
// Requried Modules
//
const moment = require('moment'),
  crypto = require('crypto'),
  { CredentialsServiceClient: CredentialsServiceClient, Credentials } = require("@trinsic/service-clients");


// Cookie Donator / Relatives
var client,
  session = {
    id: String(Date.now()),
    donator: {
      connection: {},
      credential: {},
      data: {},
      relative: {
        connection: {},
        credential: {}
      },
      registered: false
    },
    receiver: {},
    transaction: {}
  };


// invite Accepted
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

// invite Accepted
const credentialState = async function(credential) {
  if (credential.credentialId) {
    var credentialContract = await client.getCredential(credential.credentialId);
    // Check Connection State
    if (credentialContract.state == "Issued") {
      return { ready: true, credential: credentialContract }
    } else {
      return { ready: false, credential: credentialContract }
    }
  } else {
    return { ready: false, credential: credential }
  }
}

async function loader(config, localapp, db) {
  return new Promise(async function(resolve, reject) {
     try {
       client = new CredentialsServiceClient(new Credentials(config.accessToken), { noRetryPolicy: true });

      //
      // Development
      //

         // Export Sessions
         localapp.get('/api/dev/session', function(req, res) {
            res.status(200).json(session);
         });

         // Import Session
         localapp.post('/api/dev/session', function(req, res) {
            try {
              session = req.body;
              res.status(200).json({ import: true });
            } catch(err) {
              console.log(err)
              res.status(501).json({ error: "Error occured during import" });
            }
         });

         // Database Data
         localapp.post('/api/dev/db', function(req, res) {
            res.status(200).json({ import: true });
         });

      //
      // Donator Signup
      //

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
            session.donator.relative.connection = await client.createConnection({
                connectionInvitationParameters: {
                    multiParty: false
                }
            });

            // Return Invitation URL
            res.status(200).json({ url: session.donator.relative.connection.invitationUrl, invitation: session.donator.relative.connection.invitation, invitationQR: "https://chart.googleapis.com/chart?cht=qr&chl=" + session.donator.relative.connection.invitationUrl + "&chs=200x200&chld=L|1" });
         });

         // Check Invitation State
         localapp.get('/api/register/state/donator', async function(req, res) {
             res.status(200).json({ ready: session.donator.registered });
         });

         // Check Invitation State
         localapp.get('/api/connection/state/donator', async function(req, res) {
           var state = await connectionState(session.donator.connection)
           session.donator.connection = state.connection;
           if (state.ready) {
             res.status(200).json({ ready: true });
           } else {
             res.status(200).json({ ready: false });
           }
         });

         // Check Credential State
         localapp.get('/api/credential/state/donator', async function(req, res) {
           var state = await credentialState(session.donator.credential)
           session.donator.credential = state.credential;
           if (state.ready) {
             res.status(200).json({ ready: true });
           } else {
             res.status(200).json({ ready: false });
           }
         });


         // Check Invitation State
         localapp.get('/api/connection/state/relative', async function(req, res) {
           var state = await connectionState(session.donator.relative.connection)
           session.donator.relative.connection = state.connection;
           if (state.ready) {
             res.status(200).json({ ready: true });
           } else {
             res.status(200).json({ ready: false });
           }
         });

         // Check Credential State
         localapp.get('/api/credential/state/relative', async function(req, res) {
           var state = await credentialState(session.donator.relative.credential)
           session.donator.relative.credential = state.credential;
           if (state.ready) {
             res.status(200).json({ ready: true });
           } else {
             res.status(200).json({ ready: false });
           }
         });


         // Issue Credential
         localapp.post('/api/issue', async function(req, res) {
            stateD = await connectionState(session.donator.connection)
            stateR = await connectionState(session.donator.relative.connection)
            if (stateD.ready && stateR.ready) {
               // Save Given Data
               session.donator.data = req.body

               // Create Offer for Donator
               session.donator.credential = await client.createCredential({
                  definitionId: config.schema.donator,
                  connectionId: session.donator.connection.connectionId,
                  automaticIssuance: true,
                  credentialValues: {
                    Vorname: String(req.body.firstName),
                    Nachname: String(req.body.surName),
                    Geburtsdatum: String(req.body.birthDate),
                    Geburtsort: String(req.body.birthPlace),
                    Organe: String(req.body.donation),
                    Forschungszwecken: String(req.body.research)
                  }
               });

               // Create Offer for Relative
               session.donator.relative.credential = await client.createCredential({
                  definitionId: config.schema.relative,
                  connectionId: session.donator.relative.connection.connectionId,
                  automaticIssuance: true,
                  credentialValues: {
                    Vorname: String(req.body.firstName),
                    Nachname: String(req.body.surName),
                    Geburtsdatum: String(req.body.birthDate),
                    Geburtsort: String(req.body.birthPlace),
                    Organe: String(req.body.donation),
                    Forschungszwecken: String(req.body.research),
                    organDonatorCredentialID: session.donator.credential.credentialId
                  }
               });

               // Save Relation
               db.run('INSERT INTO credential_connection VALUES(?,?,?)', [
                 String(session.donator.credential.credentialId),
                 String(session.donator.relative.credential.credentialId),
                 session.id
               ]);

               // Mark As Done
               session.donator.registered = true;

               // Resolve
               res.status(200).json({ ready: true });

            } else {
              res.status(200).json({ ready: false });
            }

          //
          // Receiver Signup
          //


          //
          // Verification
          //

          //
          // Verification
          //




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
