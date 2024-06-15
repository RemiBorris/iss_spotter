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
      callback(Error(message), null);
      return;
    }
    location.latitude = body.latitude;
    location.longitude = body.longitude;
    callback(null, location);
  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  needle.get(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error,null);
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const passes = body.response;
    callback(null, passes);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, IP) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(IP,(error, coords) => {
      if (error) return callback(error, null);

      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        if (error) return callback(error, null);

        callback(null, passTimes);
      });
    });
  });
};

module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};