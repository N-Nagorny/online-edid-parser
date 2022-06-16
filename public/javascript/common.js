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
    var str = edid.split(/0x|,?\s+0x+/).join("")
    window.location.href = '/?edid=' + str

  });
});
