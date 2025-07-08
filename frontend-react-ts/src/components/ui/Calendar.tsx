import { useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");

  const startDay = startOfMonth.startOf("week");
  const endDay = endOfMonth.endOf("week");

  const today = dayjs();

  const generateCalendar = () => {
    const calendar = [];
    let date = startDay;

    while (date.isBefore(endDay, "day") || date.isSame(endDay, "day")) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(date);
        date = date.add(1, "day");
      }
      calendar.push(week);
    }
    return calendar;
  };

  const calendar = generateCalendar();

  const goToPreviousMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const goToNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  return (
    <div className="w-full p-6 bg-white shadow-md rounded font-nunito ">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="text-base px-3 py-1 rounded bg-green-100 text-green hover:bg-green-200 transition"
        >
          ← Prev
        </button>
        <h2 className="text-2xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <button
          onClick={goToNextMonth}
          className="text-base px-3 py-1 rounded bg-green-100 text-green hover:bg-green-200 transition"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-lg">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center">
        {calendar.map((week,) =>
          week.map((date) => {
            const isToday = date.isSame(today, "day");
            const isCurrentMonth = date.month() === currentDate.month();

            return (
              <div
                key={date.toString()}
                className={clsx(
                  "h-20 p-2 flex flex-col items-start justify-start text-left transition-all",
                  isToday && "bg-white text-green",
                  !isCurrentMonth && "text-gray-400 bg-gray-50",
                  isCurrentMonth && !isToday && "text-gray-800 bg-white hover:bg-green-50"
                )}
              >
                <div className="font-bold text-xl w-full text-center">{date.date()}</div>
                {/* Placeholder for future content like events */}
                
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Calendar;
