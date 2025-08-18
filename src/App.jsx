import React, { useState, useEffect, useCallback, useMemo } from "react";
import { fetchHolidays, fetchCountriesWithFallback } from "./services/api";
import CountrySelector from "./components/CountrySelector";
import HolidayList from "./components/HolidayList";
import Header from "./components/Header";
import ErrorDisplay from "./components/ErrorDisplay";
import { Globe, RefreshCw } from "lucide-react";
import "./App.css";

// Default country settings
const DEFAULT_COUNTRY = {
  code: "US",
  name: "United States",
};

const getStoredCountry= ()=>{
  try {
    return localStorage.getItem("selected-country")|| DEFAULT_COUNTRY.code;
  } catch (error) {
    console.warn("Failed to read from localStorage:",error);
    return DEFAULT_COUNTRY.code;
  }
};

const setStoredCountry =(countryCode) => {
  try {
    localStorage.setItem("selected-country", countryCode);
  } catch (error) {
    console.warn("failed to write to localStorage:",error);
  }
};

function App() {
  const [countries, setCountries] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(()=>getStoredCountry());
  // const memoizedSetStoredCountry = useCallback(setStoredCountry,[setStoredCountry]);
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
  const fetchDataWithRetry =useMemo(() =>{
    return async (fetchFn, retries = 3) => {
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
  };
  }, []); //empty depency array since this function doesn't depend on any external values

  // fetch countries only once on mount
  useEffect(() => {
    let isMounted = true; //cleanup flag to prevent state update after unmount
    const getCountries = async () => {
      try {
        setLoadingStates((prev) => ({ ...prev, countries: true }));
        setErrors((prev) => ({ ...prev, country: null }));

        const fetchedCountries = await fetchDataWithRetry(
          fetchCountriesWithFallback
        );
        if(!isMounted) return; // Prevent state update if component unmounted
        setCountries(fetchedCountries);

        // Verify if default country exists in the list, otherwise use first available
        const storedCountry = getStoredCountry();

        const storedCountryExists = fetchedCountries.some(
          (c) => c.isoCode === storedCountry
        );

        const defaultCountryExists = fetchedCountries.some(
          (c) => c.isoCode === DEFAULT_COUNTRY.code
        );
        //const currentStoredCountry = storedCountry();
        //verify if stored country exists in the list
        
        let countryToSelect = storedCountry;

        if (!storedCountryExists) {
          if(defaultCountryExists){
            countryToSelect = DEFAULT_COUNTRY.code;
          }
          else if (fetchedCountries.length > 0) {
          //use first available country if neither stored nor default exist
          countryToSelect = fetchedCountries[0].isoCode;
          console.warn(
            `Neither stored country ${storedCountry} nor ${DEFAULT_COUNTRY.name} found. Using ${fetchedCountries[0].name} as default.`
          );
        }

        //  Update both state and localStorage
        setSelectedCountry(countryToSelect);
        setStoredCountry(countryToSelect);

      } else{
        setSelectedCountry(storedCountry);
      }
      
      }
      catch (error) {
        if(!isMounted) return;
        console.error("Error fetching countries:", error);
        setErrors((prev) => ({
          ...prev,
          country: `Failed to load countries. ${error.message}`,
        }));
      } finally {
        if(isMounted)
        setLoadingStates((prev) => ({ ...prev, countries: false }));
      }
    };

    getCountries();

    // cleanup function
    return () => {
      isMounted = false;
    };
  }, [fetchDataWithRetry]);


  // fetch holidays when selected country changes
  useEffect(() => {
    if (!selectedCountry) return;

    let isMounted = true;

    const getHolidays = async () => {
      try {
        setLoadingStates((prev) => ({ ...prev, holidays: true }));
        setErrors((prev) => ({ ...prev, holiday: null }));

        console.log("Fetching holidays for country:", selectedCountry);

        const fetchedHolidays = await fetchDataWithRetry(() =>
          fetchHolidays(selectedCountry)
        );
        if(!isMounted) return
        console.log("Received holidays:", fetchedHolidays);

        const sortedHolidays = fetchedHolidays.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
        setHolidays(sortedHolidays);
      } catch (error) {
        if(isMounted) return;
        console.error("Error fetching holidays:", error);
        setErrors((prev) => ({
          ...prev,
          holiday: `Failed to load holidays for ${selectedCountry}. ${error.message}`,
        }));
      } finally {
        if(isMounted){
          setLoadingStates((prev) => ({ ...prev, holidays: false }));
        }
        
      }
    };

    getHolidays();
    
    return() =>{
      isMounted = false;
    };
  }, [selectedCountry, fetchDataWithRetry]);

//now properly saves selected country to localStorage
//handle country selection
  const handleCountryChange = useCallback((countryCode) => {
    setSelectedCountry(countryCode);
    setStoredCountry(countryCode);
  },[]);

  //retry function for countries
  const retryFetchCountries = useCallback(() => {
setLoadingStates((prev) => ({ ...prev, countries: true}));
    setErrors((prev) => ({ ...prev, country: null }));
    

    fetchDataWithRetry(fetchCountriesWithFallback)
      .then((fetchedCountries)=>{
        setCountries(fetchedCountries);

        //re-validate selected countryafter retry
        const selectedCountryExists = fetchedCountries.some(
          (c)=>c.isoCode === selectedCountry
        );
        if(!selectedCountryExists && fetchedCountries.length > 0){
          const firstCountry = fetchedCountries[0].isoCode;
          setSelectedCountry(firstCountry);
          setStoredCountry(firstCountry);
        }

      })
      .catch((error) => {
        setErrors((prev) => ({
          ...prev,
          country: `Failed to load countries. ${error.message}`,
        }));
      })
      .finally(() =>
        setLoadingStates((prev) => ({ ...prev, countries: false }))
      );
  }, [fetchDataWithRetry,selectedCountry]);
  
//get selected country name for display
const selectedCountryName = useMemo(() =>{
return countries.find((c) =>c.isoCode == selectedCountry)?.name || DEFAULT_COUNTRY.name;
},[countries,selectedCountry]); 

  
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
                  : `${new Date().getFullYear()} Public Holidays in ${selectedCountryName}`}
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
