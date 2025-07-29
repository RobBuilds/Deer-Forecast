// import { NextRequest, NextResponse } from "next/server";
//
// // app/api/deer-forecast/route.ts (Next.js 13+ App Router)
//
// export async function POST(request: NextRequest) {
//     const { lat, lon } = await request.json();
//
//     const cfRes = await fetch(
//         `https://gateway.ai.cloudflare.com/v1/d5dc49bf02deef67e4383157fde6553f/deer-forecast`,
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ lat, lon }),
//         }
//     );
//
//     const data = await cfRes.json();
//     return NextResponse.json(data, { status: cfRes.status });
// }
//
