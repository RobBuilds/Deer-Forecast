

export default function Home() {
  type DayInfo = {
    weekDay: string,
    date: number
  }
  const days: DayInfo[] = Array.from({length:7}, (_, i)=> {
    const d = new Date();
    d.setDate(d.getDate() + i);

  return {
    weekDay: d.toLocaleDateString('en-US', {weekday: 'short'}),
    date: d.getDate(),
  };
  });
    return (
        <div className="h-screen bg-gray-100 p-6">
          <input className="searchbar"/>
          <div className="flex bg-white shadow-md justify-start md:justify-center rounded-lg overflow-x-scroll mx-auto py-4 px-2 md:mx-12 mb-10">
            {days.map((day, index) => (
                <div
                    key={index}
                    className="flex group hover:bg-purple-500 hover:shadow-lg hover-dark-shadow rounded-full mx-1 transition-all duration-300 cursor-pointer justify-center w-16"
                >
                  <div className="flex items-center px-4 py-4">
                    <div className="text-center">
                      <p className="text-gray-900 group-hover:text-gray-100 text-sm transition-all group-hover:font-semibold duration-300">
                        {day.weekDay}
                      </p>
                      <p className="text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300">
                        {day.date}
                      </p>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
    );
}
