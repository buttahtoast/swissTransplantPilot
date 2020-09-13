function hideElement(element) {
  x = document.getElementById(element)
  x.style.display = "none";
}

function unhideElement(element) {
  x = document.getElementById(element)
  x.style.display = "block";
}

function onclickReceiver() {
  // Hide dontate
  hideElement("donate-1");
  hideElement("donate-2");
  hideElement("donate-3");
  hideElement("donate-4");
  hideElement("donate-5");
  unhideElement("receiver-1")
}


function initializeReceiver() {

  // Call the function in the backend
  $.ajax({
    url: config.backend + '/api/register/state/receiver',
    type: 'GET',
    contentType: 'application/json',
    success: async function(data) {
      // Present Done Page
      if (data["ready"] == true) {
        document.getElementById("register").style.display = "none";
        document.getElementById("donate-5").classList.remove("disabled");
        loadCard();
      } else {
        workflowReceiver();
      }
    }
  });

}

function workflowReceiver() {

  // Call the function in the backend
  // Call Step1
  document.getElementById("receiver-1").classList.remove("disabled");
  document.getElementById("receiver-1").scrollIntoView();
  $.ajax({
    url: config.backend + '/api/invite/receiver',
    type: 'GET',
    contentType: 'application/json',
    success: async function(data) {

      // Insert QR Code And Link
      var responseElements = '<img class="center" style="height: 400px; width: 400px;" src="' + data['invitationQR'] + '" alt="QR Code"><p style="text-align: center;font-size: 22px;color: #ffffff;">Or join via this <a target="_blank" href="' + data['url'] + '">link</a>.<br></p>'
      $('#receiver-1-response').append(responseElements); // Add Elements to do

      // Wait for Acceptance
      await state("connection", "receiver");

      // Call Step 2
      document.getElementById("receiver-1").classList.add("disabled");
      document.getElementById("receiver-3").classList.remove("disabled");
      document.getElementById("receiver-3").scrollIntoView();

    }
  });
}



function genVerifiableCredentialsorganRecipient() {

  // Call the function in the backend
  $.ajax({
    url: config.backend + '/api/issue/receiver',
    data: JSON.stringify({
      "firstName": $('#receiver-first-name').val(),
      "surName": $('#receiver-sur-name').val(),
      "birthPlace": $('#receiver-birth-place').val(),
      "birthDate": $('#receiver-birth-date').val(),
      "organ": $("#receiver-organ").val()
    }),
    type: 'POST',
    contentType: 'application/json',
    success: async function(data) {

      // Focus Step 4
      document.getElementById("receiver-3").classList.add("disabled");
      document.getElementById("receiver-4").classList.remove("disabled");
      document.getElementById("receiver-4").scrollIntoView();

      // Wait for Issueing
      await state("credential", "receiver");
      document.getElementById("receiver-status").src = 'assets/img/loaded.gif';
      await sleep(3000)

      // Done
    }
  });
}
