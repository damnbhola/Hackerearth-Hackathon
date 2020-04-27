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
  url = "https://apiforcorona.herokuapp.com/location/" + user_lat + "/" + user_long;
  loadJSON(url, gotData);
}

function gotData(data){
  console.log(data);
  content = data[0].id + " " + data[0].totalConfirmed;
  p.html(content);
}
