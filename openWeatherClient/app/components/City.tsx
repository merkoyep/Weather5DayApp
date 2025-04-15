export interface CityType {
  name: string;
  sunrise: string;
  sunset: string;
}
export const City = (city: CityType) => {
  return (
    <div className='flex flex-col items-center m-5'>
      <h1 className='text-2xl font-bold pt-2'>Forecast for {city.name}</h1>
      <p>Today's Sunrise ☀️: {city.sunrise}</p>
      <p>Today's Sunset 🌙: {city.sunset}</p>
    </div>
  );
};
