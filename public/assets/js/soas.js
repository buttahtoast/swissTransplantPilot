function workflowSOAS() {
  document.getElementById("soas-1").classList.remove("disabled");
  document.getElementById("soas-1").scrollIntoView();
  // Get all receivers
  $.ajax({
    url: config.backend + '/api/soas/get/receiver',
    type: 'GET',
    contentType: 'application/json',
    success: async function(data) {
      for (receiver in data) {
        var c = document.createElement("option")
        c.text = String(data[receiver].receiver_organ) + " - " + String(data[receiver].receiver_credential).substring(0, 6);
        c.id = String(data[receiver].receiver_credential)
        document.getElementById("sel1").options.add(c, receiver)
      }
    }
  })
  // Get all receivers
  $.ajax({
    url: config.backend + '/api/soas/get/donator',
    type: 'GET',
    contentType: 'application/json',
    success: async function(data) {
      for (receiver in data) {
        var c = document.createElement("option")
        c.text = String(data[receiver].donator_credential).substring(0, 6);
        c.id = String(data[receiver].donator_credential)
        document.getElementById("sel2").options.add(c, receiver)
      }
    }
  })
  document.getElementById("btn-match").onclick = async function() {
    document.getElementById("sel2").options[0].id
    var sel2s = document.getElementById("sel2").selectedIndex
    var sel1s = document.getElementById("sel1").selectedIndex
    $.ajax({
      url: config.backend + '/api/soas/match',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        donator_credential: document.getElementById("sel2").options[sel2s].id,
        receiver_credential: document.getElementById("sel1").options[sel1s].id
      }),
      success: async function() {
        document.getElementById("btn-match").style.backgroundColor = "lime";
      },
      fail: async function() {
        document.getElementById("btn-match").style.backgroundColor = "red";
      },
      statusCode: {
        500: async function() {
          document.getElementById("btn-match").style.backgroundColor = "red";
        },
      }
    })
  }
}
