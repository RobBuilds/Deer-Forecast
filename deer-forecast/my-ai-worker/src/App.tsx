import OpenAI from "openai";


function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
}

export default {
    async fetch(request: Request, env: any) {
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
        const { lat, long } = await request.json();

        const client = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
            baseURL: "https://gateway.ai.cloudflare.com/v1/d5dc49bf02deef67e4383157fde6553f/ai-translation/openai"
        });

        const weatherFetch = await fetch(
            `https://weather.googleapis.com/v1/forecast/days:lookup?key=${env.GOOGLE_WEATHER_API_KEY}&location.latitude=${lat}&location.longitude=${long}`,
            {
                method: "GET",
            }
        );
        const weatherData = await weatherFetch.json();
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
                    content: `Here is the data ${weatherSum}, give me 2-4 sentances and tell me the peak movement time for the AM and PM (morning and evening deer movement`
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
