
async function connectionState(endpoint) {
  var stateOk = false,
    tries = 0,
    maxtries = 20;

  while (stateOk == false) {
     console.log(stateOk)
     $.ajax({
       url:  config.backend + '/api/state/' + endpoint,
       type: 'GET',
       contentType: 'application/json',
       success: function(data) {
         if (data['ready'] == true) {
           stateOk = true;
         }
       }
     });
     await sleep(5000);
  }
}


function initializeWorkflow() {
  // Call the function in the backend
  $.ajax({
    url:  config.backend + '/api/invite/donator',
    type: 'GET',
    contentType: 'application/json',
    success: async function(data) {

      // Insert QR Code And Link
      var responseElements = '<img class="center" style="height: 400px; width: 400px;" src="' + data['invitationQR'] + '" alt="QR Code"><p style="text-align: center;font-size: 22px;color: #ffffff;">Or join via this <a target="_blank" href="' + data['url'] + '">link</a>.<br></p>'
      $('#donate-1-response').append(responseElements); // Add Elements to do

      // Wait for Acceptance
      await connectionState("donator");

      // Call Step 2
      document.getElementById("donate-1").classList.add("disabled");
      document.getElementById("donate-2").classList.remove("disabled");
      inviteRelative()
    }
  });
}


async function inviteRelative() {
  // CSS Stuff
  document.getElementById("donate-2").scrollIntoView();

  // Call the function in the backend
  $.ajax({
    url:  config.backend + '/api/invite/relative',
    type: 'GET',
    contentType: 'application/json',
    success: async function(data) {

      // Insert QR Code And Link
      var responseElements = '<img class="center" style="height: 400px; width: 400px;" src="' + data['invitationQR'] + '" alt="QR Code"><p style="text-align: center;font-size: 22px;color: #0b65a6;">Or join via this <a target="_blank" href="' + data['url'] + '">link</a>.<br></p>'
      $('#donate-2-response').append(responseElements); // Add Elements to do

      // Wait for Acceptance
      await connectionState("relative")

      // Call Step 3
      document.getElementById("donate-3").scrollIntoView();
    }
  });
}
