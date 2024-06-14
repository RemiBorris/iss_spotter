const needle = require('needle');
const ipv4Url = "https://api.ipify.org/?format=json";

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

module.exports = {fetchMyIP};