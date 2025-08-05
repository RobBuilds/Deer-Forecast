import OpenAI from "openai";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

interface Env {
  OPENAI_API_KEY: string;
  GOOGLE_WEATHER_API_KEY: string;
}
// interface RequestBody{
//   weather: any;
// }



export default {
  async fetch(request:Request, env: Env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders(),
      });
    }

    try {

      const { latitude, longitude } = await request.json() as {
        latitude: number;
        longitude: number;
      };

      const weatherRes = await fetch(
          `https://weather.googleapis.com/v1/forecast/days:lookup?key=${env.GOOGLE_WEATHER_API_KEY}&location.latitude=${latitude}&location.longitude=${longitude}`
      );
      const weatherData = await weatherRes.json() as {
        forecastDays?: any[];
      };

      const summary = JSON.stringify(weatherData.forecastDays?.[0], null, 2);

      const client = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        baseURL: "https://gateway.ai.cloudflare.com/v1/d5dc49bf02deef67e4383157fde6553f/deer-forecast/openai",
      });
      //const weatherData = await weatherRes.json();
      //const body: RequestBody = await request.json();
      //const weather = body.weather;
      // const weatherSummary = JSON.stringify(weather, null, 2);
      //const weatherSummary = JSON.stringify(weather.forecastDays?.[0], null, 2);

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a whitetail deer forecasting expert that provides peak deer movement based on weather data",
          },
          {
            role: "user",
            content: `Here is the weather data: ${summary}. Provide a 2-4 sentence forecast and note peak AM/PM movement times. Note the county/city if you know it. No more that 100 words`,
          },
        ],
      });

      return new Response(JSON.stringify({ reply: response.choices[0].message.content }), {
        headers: corsHeaders(),
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response("Internal Server Error", {
        status: 500,
        headers: corsHeaders(),
      });
    }
  },
};
