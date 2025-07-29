"use client";
import {OpenAI} from "openai";
import React, {useState, useEffect} from 'react';

//import {OpenAI} from "openai";
type ForecastSummary = {
    date: string;
    description: string;
    maxTemp: number;
    minTemp: number;
    humidity: number;
    moonPhase: string;
};
export default function SearchBar(){
    const [latQuery, setLatQuery] = useState("");
    const [longQuery, setLongQuery] = useState("");
    const [weather, setWeather] = useState<ForecastSummary[] | null>(null);




    // type WeatherApiResponse ={
    //     forecastDays: ForecastDay[];
    // }
    // type ForecastDay = {
    //     displayDate: { year: number; month: number; day: number };
    //     daytimeForecast: {
    //         weatherCondition: { description: { text: string } };
    //         relativeHumidity: number;
    //         wind: { speed: { value: number } };
    //         cloudCover: number;
    //         precipitation: { probability: { percent: number } };
    //         thunderstormProbability: number;
    //     };
    //     maxTemperature: { degrees: number };
    //     minTemperature: { degrees: number };
    //     moonEvents?: { moonPhase?: string };
    // };
//

    const handleSearch= async (e: React.FormEvent) => {
        e.preventDefault();

        const url = `https://gateway.ai.cloudflare.com/v1/d5dc49bf02deef67e4383157fde6553f/deer-forecast`

        try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        lat: latQuery,
                        lon: longQuery
                    })
                });
            if (!res.ok) throw new Error("Failed to fetch weather data");

            const data: ForecastSummary[] = await res.json();
            setWeather(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching weather data");
        }
    };

    // const formattedWeather = (weather: WeatherApiResponse | null)  =>{
    //     if(!weather || !weather.forecastDays) return [];
    //     return (weather.forecastDays as ForecastDay[]).map((day) =>{
    //         const date = `${day.displayDate.month}/${day.displayDate.day}/${day.displayDate.year}`;
    //         return {
    //             date,
    //             description: day.daytimeForecast.weatherCondition.description.text,
    //             maxTemp: day.maxTemperature.degrees,
    //             minTemp: day.minTemperature.degrees,
    //             humidity: day.daytimeForecast.relativeHumidity,
    //             windSpeed: day.daytimeForecast.wind.speed.value,
    //             cloudCover: day.daytimeForecast.cloudCover,
    //             rainChance: day.daytimeForecast.precipitation.probability.percent,
    //             thunderChance: day.daytimeForecast.thunderstormProbability,
    //             moonPhase: day.moonEvents?.moonPhase ?? "Unknown",
    //         };
    //     });
    // };
    return (
        <form onSubmit={handleSearch} className="flex items-center justify-center my-4">
            <input
                type="text"
                placeholder="Enter Latitude"
                value={latQuery}
                onChange={(e) => setLatQuery(e.target.value)}
                className="w-64 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            <input
                type="text"
                placeholder="Enter Longitude"
                value={longQuery}
                onChange={(e) => setLongQuery(e.target.value)}
                className="w-64 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-al"
                >
                Search
            </button>
            <div>
                {JSON.stringify(weather, null, 2)}
            </div>
        </form>
    );
}