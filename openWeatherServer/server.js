require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fetch = require('node-fetch');

const schema = buildSchema(`
enum Units {
    standard
    metric
    imperial
}

type Coordinates {
    zip: String
    name: String
    lat: Float
    lon: Float
    country: String
}

type WeatherCondition {
    main: String
    description: String
    icon: String
}

type WeatherData {
    temp: Float
    feels_like: Float
    temp_min: Float
    temp_max: Float
    humidity: Int
}

type ForecastItem {
    dt: Int
    temp: Float
    feelsLike: Float
    tempMin: Float
    tempMax: Float
    humidity: Int
    weather: [WeatherCondition]
    windSpeed: Float
    clouds: Int
    pop: Float
}

type CityInfo {
    id: Int
    name: String
    country: String
    sunrise: Int
    sunset: Int
}

type Forecast {
    city: CityInfo
    forecast: [ForecastItem]
}

type Query {
    getForecast(lat: Float, lon: Float, units: Units): Forecast
    getCoordinates(zip: String, countryCode: String): Coordinates
}
`);
const apikey = process.env.OPENWEATHERMAP_API_KEY;

const root = {
  getForecast: async ({ lat = null, lon = null, units = 'imperial' }) => {
    if (!lat || !lon) {
      throw new Error('Please provide latitude and longitude');
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=${units}`;
    console.log('Fetching Forecast from URL:', url);

    const res = await fetch(url);
    const json = await res.json();

    if (json.cod !== '200') {
      throw new Error(json.message);
    }

    return {
      city: {
        id: json.city.id,
        name: json.city.name,
        country: json.city.country,
        sunrise: json.city.sunrise,
        sunset: json.city.sunset,
      },
      forecast: json.list.map((item) => ({
        dt: item.dt,
        temp: item.main.temp,
        feelsLike: item.main.feels_like,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        humidity: item.main.humidity,
        weather: item.weather.map((condition) => ({
          main: condition.main,
          description: condition.description,
          icon: condition.icon,
        })),
        windSpeed: item.wind.speed,
        clouds: item.clouds.all,
        pop: item.pop,
      })),
    };
  },
  getCoordinates: async ({ zip = null, countryCode = 'us' }) => {
    if (!zip) {
      throw new Error('Please provide zip code!');
    }

    const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},${countryCode}&appid=${apikey}`;
    console.log('Fetching coordinates from URL:', url);

    try {
      const res = await fetch(url);
      const json = await res.json();

      console.log('Coordinates response:', json);

      if (json.cod && json.cod !== 200) {
        throw new Error(json.message || 'Error fetching coordinates');
      }

      return {
        zip: zip,
        name: json.name,
        lat: json.lat,
        lon: json.lon,
        country: json.country,
      };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw new Error('Failed to get coordinates: ' + error.message);
    }
  },
};

const app = express();
const cors = require('cors');
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = 4000;
app.listen(port, () => {
  console.log('Running on port:' + port);
});
