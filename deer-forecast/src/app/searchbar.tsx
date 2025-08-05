"use client";

import React, {useState, useEffect} from 'react';

//import {OpenAI} from "openai";
export default function SearchBar(){
    const [latQuery, setLatQuery] = useState("");
    const [longQuery, setLongQuery] = useState("");
    const [weather, setWeather] = useState(null);
    const[foreCast, setForecast] =  useState(null);
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY
    type WeatherApiResponse ={
        forecastDays: ForecastDay[];
    }
    type ForecastDay = {
        displayDate: { year: number; month: number; day: number };
        daytimeForecast: {
            weatherCondition: { description: { text: string } };
            relativeHumidity: number;
            wind: { speed: { value: number } };
            cloudCover: number;
            precipitation: { probability: { percent: number } };
            thunderstormProbability: number;
        };
        maxTemperature: { degrees: number };
        minTemperature: { degrees: number };
        moonEvents?: { moonPhase?: string };
    };
    const handleSearch= async (e: React.FormEvent) => {
        e.preventDefault();

        const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${API_KEY}&location.latitude=${latQuery}&location.longitude=${longQuery}`
        const workerUrl = "https://my-ai-worker.p-ai-translation.workers.dev/"
        const results =await  fetch(url);
        const weatherData = await  results.json();
        setWeather(weatherData);//add fetch hear
        const workerRes = await fetch(workerUrl, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            // body: JSON.stringify({weather}, null, 2)
            body: JSON.stringify({ weather: weatherData }, null, 2)
        });
        try {
            const deerForecast = await workerRes.json();
            setForecast(deerForecast.reply);
            console.log("AI Response:", deerForecast)
        }
        catch (err){
            const text = await workerRes.text();
            console.error("Worker response was not JSON: ", text)
        }
    };

    const formattedWeather = (weather: WeatherApiResponse | null)  =>{
        if(!weather || !weather.forecastDays) return [];
        return (weather.forecastDays as ForecastDay[]).map((day) =>{
            const date = `${day.displayDate.month}/${day.displayDate.day}/${day.displayDate.year}`;
            return {
                date,
                description: day.daytimeForecast.weatherCondition.description.text,
                maxTemp: day.maxTemperature.degrees,
                minTemp: day.minTemperature.degrees,
                humidity: day.daytimeForecast.relativeHumidity,
                windSpeed: day.daytimeForecast.wind.speed.value,
                cloudCover: day.daytimeForecast.cloudCover,
                rainChance: day.daytimeForecast.precipitation.probability.percent,
                thunderChance: day.daytimeForecast.thunderstormProbability,
                moonPhase: day.moonEvents?.moonPhase ?? "Unknown",
            };
        });
    };
    return (
        <div>
        <form
            onSubmit={handleSearch}
            className="flex flex-wrap justify-center gap-2 w-full max-w-4xl"
        >
            <input
                type="text"
                placeholder="Latitude"
                value={latQuery}
                onChange={(e) => setLatQuery(e.target.value)}
                className="w-36 sm:w-44 px-3 py-2 bg-[#3b463f] text-yellow-100 placeholder-yellow-300 border border-yellow-600 rounded-md text-sm"
            />
            <input
                type="text"
                placeholder="Longitude"
                value={longQuery}
                onChange={(e) => setLongQuery(e.target.value)}
                className="w-36 sm:w-44 px-3 py-2 bg-[#3b463f] text-yellow-100 placeholder-yellow-300 border border-yellow-600 rounded-md text-sm"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-[#2f3a35] rounded-md font-semibold hover:bg-yellow-500 transition text-sm"
            >
                Search
            </button>
        </form>

    {foreCast && (
                <div className="mt-2 w-full max-w-4xl bg-[#3b463f] text-yellow-100 border border-yellow-600 rounded-xl shadow-md p-3 whitespace-pre-wrap text-[10px] leading-tight">
                    <h2 className="text-xs font-bold mb-2 text-yellow-300 uppercase tracking-wide"/>
                    {foreCast}
                </div>
            )}
            </div>
    );}