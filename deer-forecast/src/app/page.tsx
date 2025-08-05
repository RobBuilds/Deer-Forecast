import SearchBar from "@/app/searchbar";

export default function Home() {
    type DayInfo = {
        weekDay: string,
        date: number
    }
    const days: DayInfo[] = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);

        return {
            weekDay: d.toLocaleDateString('en-US', {weekday: 'short'}),
            date: d.getDate(),
        };
    });
    const today: DayInfo = (() => {
        const d = new Date();
        return {
            weekDay: d.toLocaleDateString('en-US', {weekday: 'short'}),
            date: d.getDate(),
        };
    })();
    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            <img
                src="/Deer_forecast_logo.png"
                alt="Deer Forecast Background"
                className="absolute top-0 left-0 w-full h-full object-contain scale-130 transform z-0 bg-[#2f3a35]"
            />

            <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0" />

            <div className="relative z-10 flex flex-col items-center justify-end min-h-screen px-4 pb-12 text-yellow-100 text-center">
                <div className="w-full max-w-md">
                    <SearchBar />
                </div>

                <div className="flex overflow-x-auto py-4 px-4 space-x-4 scrollbar-hide mb-45">
                    <div className="flex items-center justify-center px-6 py-6 bg-black/60 backdrop-blur-sm rounded-xl shadow-md w-25 h-25">
                        <div className="text-center">
                            <p className="text-sm font-semibold tracking-wide uppercase">
                                {today.weekDay}
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-yellow-300">
                                {today.date}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )};
