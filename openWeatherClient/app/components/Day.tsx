import type { Forecast } from './Container';
import { timeFormatter } from './Forecast';

export const Day = (forecast: Forecast) => {
  const {
    temp,
    feelsLike,
    tempMin,
    tempMax,
    humidity,
    weather,
    windSpeed,
    clouds,
    pop,
    dt,
  } = forecast;
  return (
    <div className='border-2 rounded-md'>
      <h2>{timeFormatter.format(new Date(dt * 1000))}</h2>
      <div className='day-summary'>
        <p>
          {Math.round(tempMin)}° / Max: {Math.round(tempMax)}°
        </p>
      </div>

      <div className='forecasts'>
        {weather.map((item, index) => (
          <div key={index} className='hourly-forecast'>
            <p>{new Date(forecast.dt * 1000).getHours()}:00</p>
            <p>{forecast.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};
