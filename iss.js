const needle = require('needle');
const ipv4Url = "https://api.ipify.org/?format=json";
const locationUrl = "http://ipwho.is/";

const fetchMyIP = function(callback) {
  needle.get(ipv4Url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = body.ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const location = {};
  needle.get(locationUrl + ip,(error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${ip}`;
      callback(Error(message), null)
      return;
    }
    location.latitude = body.latitude;
    location.longitude = body.longitude;
    callback(null, location);
  });
};

module.exports = {fetchMyIP};
module.exports = {fetchCoordsByIP};