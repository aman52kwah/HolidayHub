import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Globe, MapPin } from "lucide-react";

const HolidayItem = ({ holiday }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const isMultiDay = holiday.startDate !== holiday.endDate;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm 
        overflow-hidden transition-all duration-300 ease-in-out
        hover:shadow-md ${expanded ? "shadow-md" : ""}`}
    >
      <div
        className="p-4 flex justify-between item cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-start space-x-3">
          <div
            className="bg-blue-100 text-blue-600 p-2
                    rounded-lg flex-shrink-0"
          >
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{holiday.name}</h3>
            <p className="tex-sm text-">
              {isMultiDay
                ? `${formatDate(holiday.startDate)}-
                        ${formatDate(holiday.endDate)}`
                : formatDate(holiday.startDate)}
            </p>
          </div>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label={
            expanded ? "Collapse holiday details" : "Expand holiday details"
          }
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div
          className="bg-gray-50 px-4 py-3 border-t border-gray-100
    text-sm text-gray-700 space-y-2
    animate-[fadeIn_0.2s_ease-in-out]"
        >
          <div className="flex items-center space-x-2">
            <Globe size={16} className="text-gray-500" />
            <span>
              {holiday.nationwide ? "Nationwide holiday" : "Regional holiday"}
            </span>
          </div>
          {!holiday.nationwide &&
            holiday.countries &&
            holiday.countries.length > 0 && (
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-gray-500 mt-0.5" />
                <span>Observed:{holiday.countries.join(",")}</span>
              </div>
            )}

          {holiday.type && (
            <div
              className="inline-block px-2 py-1
             bg-blue-50 text-blue-700 rounded text xs font-medium"
            >
              {holiday.type}
            </div>
          )}
          {holiday.comment && (
            <p className="text-gray-600 italic mt-2">{holiday.comment}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HolidayItem;
