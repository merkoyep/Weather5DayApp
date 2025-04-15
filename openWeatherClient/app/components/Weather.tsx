import { timeFormatter } from './Forecast';

// Accept the props with the correct shape
export interface WeatherProps {
  dt: number;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  windSpeed: number;
  clouds: number;
  pop: number;
  system: string;
}

export const Weather = (props: WeatherProps) => {
  const {
    dt,
    temp,
    feelsLike,
    tempMin,
    tempMax,
    humidity,
    weather,
    windSpeed,
    pop,
    system,
  } = props;

  return (
    <div className='border-2 p-2 m-2 rounded-md w-1/5'>
      <div className='flex justify-between'>
        <h2 className='text-sm text-left'>
          {timeFormatter.format(new Date(dt * 1000))}
        </h2>
        <div className='flex flex-col items-end'>
          <p className='text-sm'>
            {temp}°{system === 'metric' ? 'C' : 'F'}
          </p>
          <p className='text-xs text-gray-400'>
            ({feelsLike}°{system === 'metric' ? 'C' : 'F'})
          </p>
        </div>
      </div>

      <div className='day-summary'>
        {weather.map((item, index) => (
          <div
            key={`weather-${dt}-${index}`}
            className='flex justify-between items-center'
          >
            <div>
              <p className='text-xl'>{item.main}</p>
              <p className='text-xs'>{item.description}</p>
            </div>
            <img
              src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
              alt={item.description}
              className='w-15 h-15'
            />
          </div>
        ))}
        <section className='pt-5'>
          <p className='text-xs text-gray-500'>
            Wind Speed: {windSpeed} {system === 'metric' ? 'm/s' : 'mph'}
          </p>
          <p className='text-xs text-gray-500'>
            Min: {tempMin}° / Max: {tempMax}°
          </p>
          <p className='text-xs text-gray-500'>Humidity: {humidity}%</p>
          <p className='text-xs text-gray-500'>POP: {pop}%</p>
        </section>
      </div>
    </div>
  );
};
