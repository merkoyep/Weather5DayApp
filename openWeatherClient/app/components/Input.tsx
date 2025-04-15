import React, { useState } from 'react';

interface InputFormProps {
  getWeatherByLocation: () => void;
  getWeatherByZip: () => void;
  zip: string;
  setZip: (zip: string) => void;
  system: string;
  setSystem: (system: string) => void;
  countryCode: string;
  setCountryCode: (countryCode: string) => void;
  loading: boolean;
}

export const InputForm = ({
  getWeatherByLocation,
  getWeatherByZip,
  system,
  setSystem,
  loading,
  zip,
  setZip,
  countryCode,
  setCountryCode,
}: InputFormProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSystem(event.target.value);
  };

  return (
    <section className='flex flex-col gap-2 w-1/2 border-2 rounded-md p-5'>
      <div>
        <label>
          <div className='flex items-center justify-center border-2 rounded-md p-2'>
            <p className='text-center'>Forecast Units:</p>
            <select value={system} onChange={handleChange} className='h-full'>
              <option value='metric'>Metric</option>
              <option value='imperial'>Imperial</option>
            </select>
          </div>
        </label>
      </div>
      <div className='flex flex-col gap-2'>
        <button
          className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
          onClick={getWeatherByLocation}
          disabled={loading}
        >
          Use My Location
        </button>
        <h2 className='text-center'>Or</h2>
        <div className=''>
          <form
            className='flex flex-row gap-2 justify-center'
            onSubmit={(e) => {
              e.preventDefault();
              getWeatherByZip();
            }}
          >
            <input
              className='p-1 rounded-md border-2 w-24'
              placeholder={'Zip'}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <select
              className='p-1 rounded-md border-2 w-30'
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value=''>Select country</option>
              <option value='US'>United States (US)</option>
              <option value='GB'>United Kingdom (GB)</option>
              <option value='CA'>Canada (CA)</option>
              <option value='AU'>Australia (AU)</option>
              <option value='FR'>France (FR)</option>
              <option value='DE'>Germany (DE)</option>
              <option value='IT'>Italy (IT)</option>
              <option value='JP'>Japan (JP)</option>
              <option value='CN'>China (CN)</option>
              <option value='IN'>India (IN)</option>
              <option value='BR'>Brazil (BR)</option>
              <option value='RU'>Russia (RU)</option>
              <option value='MX'>Mexico (MX)</option>
              <option value='ES'>Spain (ES)</option>
            </select>

            <button
              className='text-white rounded-md p-2 text-center bg-blue-500 hover:bg-blue-600 hover:text-white active:bg-blue-700 w-48'
              type='submit'
            >
              Get Weather
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
