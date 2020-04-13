let user_lat = undefined;
let user_long = undefined;


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  user_lat = position.coords.latitude;
  user_long = position.coords.longitude;
  t = "https://apiforcorona.herokuapp.com/location/" + user_lat + "/" + user_long;

  var request = new XMLHttpRequest()
  request.open('GET', t, true)
  request.onload = function() {
    var data = JSON.parse(this.response)
    p.html(data);
  }
  request.send()
}
