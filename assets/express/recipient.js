// Functions for reciepients

// New Invitation Generation

const createInvitation = async function (req, res)  {
  session.receiver.connection = await client.createConnection({
      connectionInvitationParameters: {
          multiParty: false
      }
  });

  // Return Invitation URL
  res.status(200).json({ url: session.receiver.connection.invitationUrl, invitation: session.receiver.connection.invitation, invitationQR: "https://chart.googleapis.com/chart?cht=qr&chl=" + session.receiver.connection.invitationUrl + "&chs=200x200&chld=L|1" });
}
