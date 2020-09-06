

function genVerifiableCredentials() {
  var donation;
  if (document.getElementById("donation").checked == true) {
    donation = true
  } else {
    donation = false
  }
  var research;
  if (document.getElementById("research").checked == true) {
     research = true
  } else {
     research = false
  }

  // Call the function in the backend
  $.ajax({
    url:  config.backend + '/api/issue',
    data: JSON.stringify({
      "donator": donation,
      "research": research
    }),
    type: 'POST',
    contentType: 'application/json',
    success: function(data) {
      // Remove elements if they already exist
      console.log(data);
    }
  });
}
