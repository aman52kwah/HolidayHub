import React from "react";
import { Calendar } from "lucide-react";
import HolidayItem from "./HolidayItem";

const HolidayList = ({ holidays, isLoading, error }) => {
  const groupHolidaysByMonth = (holidays) => {
    return holidays.reduce((groups, holiday) => {
      const date = new Date(holiday.startDate);
      const monthName = date.toLocaleString("en-US", {
        month: "long",
      });
      if (!groups[monthName]) {
        groups[monthName] = [];
      }
      groups[monthName].push(holiday);
      return groups;
    }, {});
  };
  const sortedGroupHolidays = () => {
    const grouped = groupHolidaysByMonth(holidays);
    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    return Object.entries(grouped).sort(([monthA], [monthB]) => {
      return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
    });
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-blue-400 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mb-2.5"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </div>
        <p className="mt-4 text-gray-">Loading holidays</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full bg-red-50 border border-red-200 
            rounded-lg p-6 text-center"
      >
        <div className="text-red-500 mb-2">Error loading holidays</div>
        <p className="text-red-700">{error}</p>
        <p className="mt-4 text-gray-6">
          Please try again later or select a different country.
        </p>
      </div>
    );
  }
  if (holidays.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <Calendar size={48} className="mb-4 text-gray-400" />

        <h3 className="text-xl font-medium mb">No holidays found</h3>
        <p>There are no public holidays available for the selected country.</p>
      </div>
    );
  }
  const grouped = sortedGroupHolidays();

  return (
    <div className="w-full space-y-8">
      {grouped.map(([month, monthHolidays]) => (
        <div key={month} className="animation-fade-in ">
          <h2
            className="text-xl font-semibold text-gray-800 mb-4 
                border-b border-gray-200 pb-2"
          >
            {month}
          </h2>
          <div className="space-y-3">
            {monthHolidays.map((holiday, index) => (
              <HolidayItem key={`${holiday.date} - ${holiday.name} - ${index}`} holiday={holiday} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HolidayList;
