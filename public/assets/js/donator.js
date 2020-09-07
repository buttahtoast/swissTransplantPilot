function initialize() {

  // Call the function in the backend
  $.ajax({
    url:  config.backend + '/api/register/state/donator',
    type: 'GET',
    contentType: 'application/json',
    success: async function(data) {
      // Present Done Page
      if (data["ready"] == true) {
        document.getElementById("register").style.display = "none";
        document.getElementById("donate-5").classList.remove("disabled");
      } else {
        workflow();
      }
    }
  });

}


function workflow() {

  // Call the function in the backend
  $.ajax({
    url:  config.backend + '/api/invite/donator',
    type: 'GET',
    contentType: 'application/json',
    success: async function(data) {

      // Insert QR Code And Link
      inviteRelative();
      var responseElements = '<img class="center" style="height: 400px; width: 400px;" src="' + data['invitationQR'] + '" alt="QR Code"><p style="text-align: center;font-size: 22px;color: #ffffff;">Or join via this <a target="_blank" href="' + data['url'] + '">link</a>.<br></p>'
      $('#donate-1-response').append(responseElements); // Add Elements to do

      // Wait for Acceptance
      await state("connection", "donator");

      // Call Step 2
      document.getElementById("donate-1").classList.add("disabled");
      document.getElementById("donate-2").classList.remove("disabled");
      document.getElementById("donate-2").scrollIntoView();

      // Wait for Acceptance
      await state("connection", "relative")

      // Focus Step 3
      document.getElementById("donate-2").classList.add("disabled");
      document.getElementById("donate-3").classList.remove("disabled");
      document.getElementById("donate-3").scrollIntoView();
    }
  });
}


async function inviteRelative() {

  // Call the function in the backend
  $.ajax({
    url:  config.backend + '/api/invite/relative',
    type: 'GET',
    contentType: 'application/json',
    success: async function(data) {
      // Insert QR Code And Link
      var responseElements = '<img class="center" style="height: 400px; width: 400px;" src="' + data['invitationQR'] + '" alt="QR Code"><p style="text-align: center;font-size: 22px;color: #0b65a6;">Or join via this <a target="_blank" href="' + data['url'] + '">link</a>.<br></p>'
      $('#donate-2-response').append(responseElements); // Add Elements to do
    }
  });
}


function genVerifiableCredentials() {
  var research;
  if (document.getElementById("donator-research").checked == true) {
     research = true
  } else {
     research = false
  }

  // Call the function in the backend
  $.ajax({
    url:  config.backend + '/api/issue',
    data: JSON.stringify({
      "firstName": $('#donator-first-name').val(),
      "surName": $('#donator-sur-name').val(),
      "birthPlace": $('#donator-birth-place').val(),
      "birthDate": $('#donator-birth-date').val(),
      "donation": $("input[name=donation]:checked").val(),
      "research": research
    }),
    type: 'POST',
    contentType: 'application/json',
    success: async function(data) {

      // Focus Step 4
      document.getElementById("donate-3").classList.add("disabled");
      document.getElementById("donate-4").classList.remove("disabled");
      document.getElementById("donate-4").scrollIntoView();

      // Wait for Issueing
      await state("credential", "donator");
      document.getElementById("donator-status").src = 'assets/img/loaded.gif';
      await state("credential", "relative");
      document.getElementById("relative-status").src = 'assets/img/loaded.gif';
      await sleep(3000)

      // Focus Step 5
      document.getElementById("donate-4").classList.add("disabled");
      document.getElementById("donate-5").classList.remove("disabled");
      document.getElementById("donate-5").scrollIntoView();

    }
  });
}
