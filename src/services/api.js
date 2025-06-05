const API_BASE_URL = "https://date.nager.at/api/v3";
const API_KEY = "stRLzQ2sv1GRr05d0ZFcnXv9y2cKcz8W";

export const fetchCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/AvailableCountries`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status:
                ${response.status}`);
    }

    const countries = await response.json();
    return countries.map((country) => ({
      isoCode: country.countryCode,
      name: country.name,
    }));
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const fetchHolidays = async (countryIsoCode) => {
  try {
    const currentYear = new Date().getFullYear();

    const response = await fetch(
      `${API_BASE_URL}/PublicHolidays/${currentYear}/${countryIsoCode}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status:
                ${response.status}`);
    }
    const holidays = await response.json();
    
    return holidays.map((holiday) => ({
      ...holiday,
      startDate: holiday.date,
      name: holiday.localName || holiday.name,
      
    }));
    
  } catch (error) {
    console.error("Error fetching holidays:", error);
    throw error;
  }

};
  

export const FALLBACK_COUNTRIES = [
  { isoCode: "US", name: "United States" },
  { isoCode: "CA", name: "Canada" },
  { isoCode: "GB", name: "United Kingdom" },
  { isoCode: "AU", name: "Australia" },
  { isoCode: "IN", name: "India" },
  { isoCode: "DE", name: "Germany" },
  { isCode: "FR", name: "France" },
  { isoCode: "JP", name: "Japan" },
  { isoCode: "CN", name: "China" },
  { isoCode: "BR", name: "Brazil" },
  { isoCode: "GH", name: "Ghana" },
  { isoCode: "ZA", name: "South Africa" },
  { isoCode: "NG", name: "Nigeria" },
  { isoCode: "MX", name: "Mexico" },
  { isoCode: "ES", name: "Spain" },
  { isoCode: "IT", name: "Italy" },
  { isoCode: "RU", name: "Russia" },
  { isoCode: "KR", name: "South Korea" },
  { isoCode: "SE", name: "Sweden" },
  { isoCode: "NO", name: "Norway" },
  { isoCode: "FI", name: "Finland" },
];

export const fetchCountriesWithFallback = async () => {
  try {
    return await fetchCountries();
  } catch (error) {
    console.warn("Error fetching countries with fallback:", error);
    return FALLBACK_COUNTRIES;
  }
};

export const fetchHolidaysWithFallback = async (countryCode) => {
  try {
    return await fetchHolidays(countryCode);
  } catch (PrimaryError) {
    console.warn("Primary Api failed, trying fallback...", PrimaryError);
    try {
      const response = await fetch(
        `https://calendarific.com/api/v2/holidays?api_Key=${API_KEY}&country=${countryCode}&year=${new Date().getFullYear()}`
      );
      const data = await response.json();
      return data.response.holidays;
    } catch (fallbackError) {
      throw new Error(
        `Both primary and fallback API calls failed: ${fallbackError.message} and ${PrimaryError.message}`
      );
    }
  }
};
