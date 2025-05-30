import React, { useState, useEffect, useCallback } from "react";
import { fetchHolidays,fetchCountriesWithFallback } from "./services/api";
import CountrySelector from "./components/CountrySelector";
import HolidayList from "./components/HolidayList";
import Header from "./components/Header";
import ErrorDisplay from "./components/ErrorDisplay";
import { Globe, RefreshCw } from "lucide-react";
import "./App.css";

// Default country settings
const DEFAULT_COUNTRY = {
  code: "ZA",
  name: "south africa",
  
};

function App() {
  const [countries, setCountries] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY.code);
  const [loadingStates, setLoadingStates] = useState({
    countries: true,
    holidays: true,
  });
  const [errors, setErrors] = useState({
    country: null,
    holiday: null,
  });

  // Enhanced fetch with retry logic
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDataWithRetry = useCallback(async (fetchFn, retries = 3) => {
    try {
      return await fetchFn();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts left`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return fetchDataWithRetry(fetchFn, retries - 1);
      }
      throw error;
    }
  });

  useEffect(() => {
    const getCountries = async () => {
      try {
        setLoadingStates((prev) => ({ ...prev, countries: true }));
        setErrors(  (prev) => ({ ...prev, country: null }));

        const fetchedCountries = await fetchDataWithRetry(fetchCountriesWithFallback);
        setCountries(fetchedCountries);

        // Verify if default country exists in the list, otherwise use first available
        const defaultCountryExists = fetchedCountries.some(
          (c) => c.isoCode === DEFAULT_COUNTRY.code
        );

        if (!defaultCountryExists && fetchedCountries.length > 0) {
          setSelectedCountry(fetchedCountries[0].isoCode);
          console.warn(
            `${DEFAULT_COUNTRY.name} not found in countries list. Using ${fetchedCountries[0].name} as default.`
          );
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setErrors((prev) => ({
          ...prev,
          country: `Failed to load countries. ${error.message}`,
        }));
      } finally {
        setLoadingStates((prev) => ({ ...prev, countries: false }));
      }
    };

    getCountries();
  }, []);

  useEffect(() => {
    const getHolidays = async () => {
      if (!selectedCountry) return;

      try {
        setLoadingStates((prev) => ({ ...prev, holidays: true }));
        setErrors((prev) => ({ ...prev, holiday: null }));

        console.log("Fetching holidays for country:", selectedCountry);

        const fetchedHolidays = await fetchDataWithRetry(() =>
          fetchHolidays(selectedCountry)
        );
        console.log("Received holidays:",fetchedHolidays);

        const sortedHolidays = fetchedHolidays.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
        setHolidays(sortedHolidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
        setErrors((prev) => ({
          ...prev,
          holiday: `Failed to load holidays for ${selectedCountry}. ${error.message}`,
        }));
      } finally {
        setLoadingStates((prev) => ({ ...prev, holidays: false }));
      }
    };

    getHolidays();
  },[selectedCountry]);

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
  };

  const retryFetchCountries = useCallback(() => {
    setCountries([]);
    setErrors((prev) => ({ ...prev, country: null }));
    setLoadingStates((prev) => ({ ...prev, countries: false }));

    fetchDataWithRetry(fetchCountriesWithFallback)
      .then(setCountries)
      .catch((error) => {
        setErrors((prev) => ({
          ...prev,
          country: `Failed to load countries. ${error.message}`,
        }));
      })
      .finally(() =>
        setLoadingStates((prev) => ({ ...prev, countries: false }))
      );
  },[fetchDataWithRetry]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {errors.country ? (
          <ErrorDisplay
            message={errors.country}
            onRetry={retryFetchCountries}
          />
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col gap-4">
                <CountrySelector
                  countries={countries}
                  selectedCountry={selectedCountry}
                  isLoading={loadingStates.countries}
                  onSelectCountry={handleCountryChange}
                  defaultCountry={DEFAULT_COUNTRY.code}
                />

                {!loadingStates.countries && (
                  <div className="hidden md:flex items-center space-x-2 text-gray-500 text-sm">
                    <Globe size={16} />
                    <span>{countries.length} countries available</span>
                    <button
                      onClick={retryFetchCountries}
                      className="ml-2 flex items-center text-blue-500 hover:text-blue-700"
                      disabled={loadingStates.countries}
                    >
                      <RefreshCw size={14} className="mr-1" />
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {loadingStates.holidays
                  ? "Loading holidays..."
                  : errors.holiday
                  ? "Holiday Data Unavailable"
                  : `${new Date().getFullYear()} Public Holidays in ${
                      countries.find((c) => c.isoCode === selectedCountry)
                        ?.name || DEFAULT_COUNTRY.name
                    }`}
              </h2>
              <HolidayList
                holidays={holidays}
                isLoading={loadingStates.holidays}
                error={errors.holiday}

              />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 px-4">
        <div className="container mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} National Holidays App</p>
          <p className="mt-2">Data provided by NagerAPI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

