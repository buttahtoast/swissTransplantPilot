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


function initializeVerfication() {

  workflowVerfication();

}


function workflowVerfication() {

  // Call the function in the backend
  // Call Step1
  document.getElementById("verification-1").classList.remove("disabled");
  document.getElementById("verification-1").scrollIntoView();
  document.getElementById("btn-verify").onclick = async function() {
    postConnectionID();
    document.getElementById("verification-2").classList.remove("disabled");
    document.getElementById("verification-1").classList.add("disabled");
    document.getElementById("verification-2").scrollIntoView();
    $.ajax({
      url: config.backend + '/api/verification/check/database',
      type: 'GET',
      contentType: 'application/json',
      success: async function() {
        document.getElementById("verification-status").src = 'assets/img/loaded.gif';
      },
      fail: async function() {
        document.getElementById("verification-status").src = 'assets/img/failed2.gif';
        await sleep(3000000)
      },
      statusCode: {
        500: async function() {
          document.getElementById("verification-status").src = 'assets/img/failed2.gif';
          await sleep(3000000)
        },
      }
    })
    await sleep(3000)
    document.getElementById("verification-2").classList.add("disabled");
    document.getElementById("verification-3").classList.remove("disabled");
    document.getElementById("verification-3").scrollIntoView();
    $.ajax({
      url: config.backend + '/api/verification/check/relative',
      type: 'GET',
      contentType: 'application/json',
      fail: async function() {
        document.getElementById("verification-status").src = 'assets/img/failed2.gif';
        return
      },
      statusCode: {
        500: function() {
          document.getElementById("verification-status").src = 'assets/img/failed2.gif';
          return
        },
      }
    })
    await sleep(5000)
    await state("verification", "relative");
    document.getElementById("verification-status2").src = 'assets/img/loaded.gif';
    $.ajax({
      url: config.backend + '/api/verification/state/relative',
      type: 'GET',
      contentType: 'application/json',
      success: async function(data) {
        document.getElementById("donator-first-name").readOnly = true
        document.getElementById("donator-first-name").value = data.verification.proof.test.attributes.Vorname
        document.getElementById("donator-sur-name").readOnly = true
        document.getElementById("donator-sur-name").value = data.verification.proof.test.attributes.Nachname
        document.getElementById("donator-birth-date").readOnly = true
        document.getElementById("donator-birth-date").value = data.verification.proof.test.attributes.Geburtsdatum
        document.getElementById("donator-birth-place").readOnly = true
        document.getElementById("donator-birth-place").value = data.verification.proof.test.attributes.Geburtsort
        document.getElementById("donator-organs").readOnly = true
        document.getElementById("donator-organs").value = data.verification.proof.test.attributes.Organe
        document.getElementById("donator-organs").readOnly = true
        document.getElementById("donator-research").value = data.verification.proof.test.attributes.Forschungszwecken
      },
      statusCode: {
        500: function() {
          document.getElementById("verification-status").src = 'assets/img/failed2.gif';
          return
        },
      }
    })
    await sleep(3000)
    document.getElementById("verification-3").classList.add("disabled");
    document.getElementById("verification-4").classList.remove("disabled");
    document.getElementById("verification-4").scrollIntoView();
    document.getElementById("btn-verify-ok").onclick = async function() {
      $.ajax({
        url: config.backend + '/api/verification/add/donator',
        type: 'GET',
        contentType: 'application/json',
        success: async function() {
          document.getElementById("btn-verify-ok").style.backgroundColor = "lime";
        },
        fail: async function() {
          document.getElementById("btn-verify-ok").style.backgroundColor = "red";
        },
        statusCode: {
          500: async function() {
            document.getElementById("btn-verify-ok").style.backgroundColor = "red";
          },
        }
      })
    }

  }

}


// $.ajax({
//   url: config.backend + '/api/verification/receiver',
//   type: 'GET',
//   contentType: 'application/json',
//   success: async function(data) {
//
//     // Insert QR Code And Link
//     var responseElements = '<img class="center" style="height: 400px; width: 400px;" src="' + data['invitationQR'] + '" alt="QR Code"><p style="text-align: center;font-size: 22px;color: #ffffff;">Or join via this <a target="_blank" href="' + data['url'] + '">link</a>.<br></p>'
//     $('#receiver-1-response').append(responseElements); // Add Elements to do
//
//     // Wait for Acceptance
//     await state("connection", "receiver");
//
//     // Call Step 2
//     document.getElementById("receiver-1").classList.add("disabled");
//     document.getElementById("receiver-3").classList.remove("disabled");
//     document.getElementById("receiver-3").scrollIntoView();
//
//   }
// });
//}


function checkDatabse() {
  return $.ajax({
    url: config.backend + '/api/verification/check/database',
    type: 'GET',
    contentType: 'application/json',
  })
}

function generateVerfication() {
  return $.ajax({
    url: config.backend + '/api/verification/check/relative',
    data: JSON.stringify({
      "connectionID": $('#verification-connectionID')
    }),
    type: 'GET',
    contentType: 'application/json',
  })
}

function checkVerfication() {
  return $.ajax({
    url: config.backend + '/api/verification/check/relative/state',
    data: JSON.stringify({
      "connectionID": $('#verification-connectionID')
    }),
    type: 'GET',
    contentType: 'application/json',
  })
}

function postConnectionID() {
  return $.ajax({
    url: config.backend + '/api/verification',
    data: JSON.stringify({
      "ConnectionID": $('#verification-connectionID').val(),
    }),
    type: 'POST',
    contentType: 'application/json',
  })
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
