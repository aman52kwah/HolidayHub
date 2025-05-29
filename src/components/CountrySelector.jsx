import React from "react";
import { ChevronDown } from "lucide-react";

const CountrySelector = ({
  countries,
  selectedCountry,
  isLoading,
  onSelectCountry,
}) => {
  const handleChange = (e) => {
    onSelectCountry(e.target.value);
  };

  const selectedCountryName =
    countries.find((c) => c.isoCode === selectedCountry)?.name || "Loading...";

  return (
    <div className="relative w-full max-w-xs">
      <label
        htmlFor="country-select"
        className="block text-sm font-medium
             text-gray-700 mb-1"
      >
        Select a country
      </label>
      <div className="relative">
        <select
          id="country-select"
          value={selectedCountry}
          onChange={handleChange}
          disabled={isLoading || countries.length === 0}
          className={`block w-dull py-2.5 px-4 pr-10 text-base bg-white
                 border border-gray-300 rounded-lg shadow-sm focus:outline-none
                 focus:ring-2 focus:ring-blue-500
                 focus:border-blue-500 appearance-none
                 transition-colors
                 ${
                   isLoading
                     ? "opacity-75 cursor-not-allowed"
                     : "cursor-pointer"
                 }`}
        >
          {isLoading ? (
            <option value="">Loading countries</option>
          ) : (
            countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))
          )}
        </select>
        <div
          className="pointer-events-none absolute 
                inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
          <ChevronDown size={18} />
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {isLoading
          ? "Loading availabe countries..."
          : `Currently showind holidays for ${selectedCountryName}`}
      </p>
    </div>
  );
};

export default CountrySelector;
