function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function state(endpoint, party) {
  var stateOk = false;
  while (stateOk == false) {
     $.ajax({
       url:  config.backend + '/api/'+ endpoint + '/state/' + party,
       type: 'GET',
       contentType: 'application/json',
       success: function(data) {
         if (data['ready'] == true) {
           stateOk = true;
         }
       }
     });
     await sleep(2000);
  }
}
