const request = require('postman-request');

const forecast = (lat, long, callback) => {

    const url = "https://api.weatherstack.com/current?access_key=8c142b81582de829c0bb9c43d8968d13&query=" + lat + ',' + long + "&units=m";

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback("unable to connect to weather service", undefined);

        }
        else if (response.body.error) {
            callback("Unable to find location data. Try another search.", undefined);
        }
        else {
            const temp = response.body.current.temperature;
            const feels_like = response.body.current.feelslike;

            callback(undefined, `${response.body.current.weather_descriptions[0]}. It is currently ${temp} degrees out. It feels like ${feels_like} degrees out.`);
        }
    });


}

module.exports = forecast;