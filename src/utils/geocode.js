const request = require('postman-request');

const geocode = (address, callback) => {

    const url = "https://api.mapbox.com/search/geocode/v6/forward?q=" + encodeURIComponent(address) + "&access_token=pk.eyJ1IjoiZS1sb2tlc2giLCJhIjoiY204eWxjanAwMDF1MDJqcjZldmtsMnRvdiJ9.pk9T18CCD6UN8fCvoHKqww&limit=1";

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback("unable to connect to location service", undefined);
        }
        else if (response.body.features.length === 0) {
            callback("Unable to find location. Try another search.", undefined);
        }
        else {

            callback(undefined, {
                latitude: response.body.features[0].properties.coordinates.latitude,
                longitude: response.body.features[0].properties.coordinates.longitude,
                location: response.body.features[0].properties.context.place.name
            })
        }
    });
}

module.exports = geocode;