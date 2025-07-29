import OpenAI from "openai";


function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
type WeatherCondition = {
  description: { text: string };
};

type DaytimeForecast = {
  weatherCondition: WeatherCondition;
  relativeHumidity: number;
  wind: { speed: { value: number } };
  cloudCover: number;
  precipitation: { probability: { percent: number } };
  thunderstormProbability: number;
};

type ForecastDay = {
  displayDate: { year: number; month: number; day: number };
  daytimeForecast: DaytimeForecast;
  maxTemperature: { degrees: number };
  minTemperature: { degrees: number };
  moonEvents?: { moonPhase?: string };
};
type Env = {
  OPENAI_API_KEY: string;
  GOOGLE_WEATHER_API_KEY: string;
};

type WeatherApiResponse = {
  forecastDays?: ForecastDay[];
};

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === "OPTIONS"){
      return new Response(null, {
        status:204,
        headers: corsHeaders()
      });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", {status: 405,
        headers: corsHeaders()
      });
    }
    const { lat, lon } = await request.json() as {lat: number; lon: number};
    // const url = new URL(request.url);
    // const lat = url.searchParams.get("lat");
    // const lon = url.searchParams.get("lon");

    if (!lat || !lon) {
      return new Response("Missing lat or lon", {
        status: 400,
        headers: corsHeaders()
      });
    }
    const client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: "https://gateway.ai.cloudflare.com/v1/d5dc49bf02deef67e4383157fde6553f/openai"
    });

    const weatherFetch = await fetch(
        `https://weather.googleapis.com/v1/forecast/days:lookup?key=${env.GOOGLE_WEATHER_API_KEY}&location.latitude=${lat}&location.longitude=${lon}`,
        {
          method: "GET",
        }
    );
    const weatherData = await weatherFetch.json() as WeatherApiResponse;

    const weatherSum = JSON.stringify(weatherData.forecastDays?.[0], null, 2);
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "you are a expert whitetail deer forecaster basing deer movement off of the data you receive"
        },
        {
          role: "user",
          content: `Here is the data ${weatherSum}, give me 2-4 sentences and tell me the peak movement time for the AM and PM (morning and evening) deer movement`
        }
      ]

    })


    return new Response(JSON.stringify({
      reply: response.choices[0].message.content
    }), {
      headers: corsHeaders()
    });

  },
};
