import type { WeatherType } from './Container.js';
import { City } from './City';
import type { CityType } from './City';
import { Weather, type WeatherProps } from './Weather.js';

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});

export const Forecast = (props: { weather: WeatherType; system: string }) => {
  const { weather, system } = props;
  const sunrise = timeFormatter.format(new Date(weather.city.sunrise * 1000));
  const sunset = timeFormatter.format(new Date(weather.city.sunset * 1000));

  const cityData: CityType = { name: weather.city.name, sunrise, sunset };
  const forecastList = weather.forecast;

  const getDate = (date: Number) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return formatter.format(new Date((date as number) * 1000));
  };

  const groupedForecasts = forecastList.reduce((acc, forecast) => {
    const dateKey = getDate(forecast.dt);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(forecast);
    return acc;
  }, {} as Record<string, typeof forecastList>);

  return (
    <div>
      <City {...cityData} />

      {Object.entries(groupedForecasts).map(([date, forecasts]) => (
        <div key={date} className='date-group'>
          <h1 className='px-3 text-gray-600'>{date}</h1>
          <div className='p-1 flex flex-wrap'>
            {forecasts.map((forecast) => (
              <Weather key={forecast.dt} {...forecast} system={system} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
