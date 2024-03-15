import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Loader from './loader';
import Switch from './switch';
import Temp from './temp';

import search from '../assets/search.svg';
import Clouds from './clouds';

function Container({ theme, setTheme, userTheme, time}) {

    const [weather, setWeather] = useState(null);
    const [address, setAddress] = useState('');

    async function request_weather_info() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        invoke('request_weather_info', { geo: address })
            .then(result => {
                console.log(`It is ${result.temp_c.toFixed(2)}°C (${result.temp_f.toFixed(2)}°F) in ${result.place}.`);
                setWeather(result)
            })
            .catch(err => console.error(err));
    }

    return (
        <>
            {weather && weather.more[0].main === 'Clouds' && <Clouds />}
            <div className='container'>
                <Switch boolean={setTheme} checked={theme} userTheme={userTheme} />

                <div className='box'>
                    <h1>Enter yor location :)</h1>

                    <form autoComplete='off'
                        className='row'
                        onSubmit={(e) => {
                            e.preventDefault();
                            request_weather_info();
                            e.target.reset();
                        }}
                    >
                        <input
                            id='greet-input'
                            onChange={(e) => setAddress(e.currentTarget.value)}
                            placeholder='Enter a country/city...'
                        />
                        <button type='submit'>
                            <img src={search} alt='search' />
                        </button>
                    </form>

                    <h2 className='subtitle'>
                        <span style={{ display: 'block', marginBottom: '5px' }}>{weather && weather.place[0].toUpperCase() + weather.place.slice(1) + ', ' + weather.country}</span>
                        {
                            weather
                                ? `
                                    ${time.toLocaleString('en-EN', { weekday: 'short' })},
                                    ${time.toLocaleString('en-EN', { month: 'short'  })} ${time.getDate()}`
                                : 'Enter yor location :)'
                        }
                    </h2>


                    <Loader />

                    {weather && <Temp data={weather} />}

                    <div className="weather-conditions">
                        {weather && weather.more[0].icon ? <img src={`https://openweathermap.org/img/wn/${weather.more[0].icon}.png`} alt="weather icon" /> : null}
                        <p>{weather && weather.more[0].description}</p>
                    </div>
                </div>
            </div>
        
        </>
    );
}

export default Container;
