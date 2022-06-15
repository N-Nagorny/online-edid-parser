function errorMessage (XMLHttpRequest, textStatus, errorThrown) {
  console.log(XMLHttpRequest.status + " " + XMLHttpRequest.responseText);
  alert('Error: ' + XMLHttpRequest.status + '\n' + XMLHttpRequest.responseText);
  return false;
}

$(function parseEdid() {
  var port = window.location.port;
  var host = window.location.hostname;
  $("#parseBtn").click(() => {

    var edid = document.getElementById("inputEdid").value;
    $.ajax({
      url: '//' + host + ':' + port + '/api/edid',
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify(edid.split(/,?\s+/)),
      // data: JSON.stringify(body),
      crossDomain: false,
      success: function(data) {
        console.log(data)
        $("#parsedEdid").text(data.edid)
      },
      error: errorMessage
    });

  });
});
