import { useState } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { InputForm } from './Input';
import { Forecast } from './Forecast';

interface City {
  name: string;
  country: string;
  sunrise: number;
  sunset: number;
}
interface Weather {
  main: string;
  description: string;
  icon: string;
}
export interface Forecast {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  weather: Weather[];
  windSpeed: number;
  clouds: number;
  pop: number;
  dt: number;
}

export interface WeatherType {
  city: City;
  forecast: Forecast[];
}

const GET_WEATHER = gql`
  query GetWeather($lat: Float, $lon: Float, $units: Units!) {
    getForecast(lat: $lat, lon: $lon, units: $units) {
      city {
        name
        country
        sunrise
        sunset
      }
      forecast {
        dt
        temp
        feelsLike
        tempMin
        tempMax
        humidity
        weather {
          main
          description
          icon
        }
        windSpeed
        clouds
        pop
      }
    }
  }
`;
const GET_COORDINATES = gql`
  query GetCoordinates($zip: String, $countryCode: String) {
    getCoordinates(zip: $zip, countryCode: $countryCode) {
      zip
      name
      lat
      lon
      country
    }
  }
`;

export const Container = () => {
  const client = useApolloClient();
  const [system, setSystem] = useState('metric');
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [loading, setLoading] = useState(false);
  const [zip, setZip] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [coordinates, setCoordinates] = useState<{
    latitude: string;
    longitude: string;
  }>({ latitude: '', longitude: '' });

  async function getWeatherByLocation() {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            console.log('Querying with:', {
              lat: latitude,
              lon: longitude,
              units: system,
            });

            const { data } = await client.query({
              query: GET_WEATHER,
              variables: {
                lat: parseFloat(latitude.toFixed(4)),
                lon: parseFloat(longitude.toFixed(4)),
                units: system,
              },
              fetchPolicy: 'network-only',
            });
            console.log('Received data:', data);
            if (!data || !data.getForecast) {
              throw new Error('No forecast data received');
            }
            setWeather(data.getForecast);
          } catch (err: any) {
            console.log(err.message);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
    console.log(weather);
  }
  async function getWeatherByZip() {
    setLoading(true);
    try {
      console.log('Getting coordinates for zip:', zip, countryCode);

      const { data: coordData } = await client.query({
        query: GET_COORDINATES,
        variables: {
          zip: zip,
          countryCode: countryCode,
        },
        fetchPolicy: 'network-only',
      });

      console.log('Coordinates:', coordData);

      if (!coordData || !coordData.getCoordinates) {
        throw new Error('No coordinates found for this zip/country');
      }

      const { lat, lon } = coordData.getCoordinates;

      const { data: weatherData } = await client.query({
        query: GET_WEATHER,
        variables: {
          lat: lat,
          lon: lon,
          units: system,
        },
        fetchPolicy: 'network-only',
      });

      console.log('Weather data:', weatherData);
      if (!weatherData || !weatherData.getForecast) {
        throw new Error('No forecast data received');
      }

      setWeather(weatherData.getForecast);
    } catch (err: any) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='flex flex-col items-center w-2/3'>
      {!loading ? (
        <InputForm
          getWeatherByLocation={getWeatherByLocation}
          getWeatherByZip={getWeatherByZip}
          system={system}
          setSystem={setSystem}
          loading={loading}
          zip={zip}
          setZip={setZip}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
        />
      ) : (
        <p>Loading ☀️ 🌧️ ❄️ 💨</p>
      )}

      {weather && <Forecast weather={weather} system={system} />}
    </div>
  );
};
