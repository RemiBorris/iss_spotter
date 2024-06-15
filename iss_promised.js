const needle = require('needle');

const fetchMyIP = function() {
  return needle("get","https://api.ipify.org/?format=json")
    .then((response) => {
      return response.body.ip;
    });
};


const fetchCoordsByIP = function(ip) {
  const location = {};
  return needle("get",`http://ipwho.is/${ip}`)
    .then((response) => {
      location.latitude = response.body.latitude;
      location.longitude = response.body.longitude;
      return location;
    });
};

const fetchISSFlyOverTimes = function(coords) {
  return needle("get",`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`)
    .then((response) =>{
      return response.body.response;
    });
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then((ip) => fetchCoordsByIP(ip))
    .then((coords) => fetchISSFlyOverTimes(coords))
    .then((passTimes) => {
      return passTimes;
    });
};


module.exports = { nextISSTimesForMyLocation };