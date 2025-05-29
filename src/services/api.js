const API_BASE_URL = "https://date.nager.at/api/v3/publicholidays/2025/US";
//https://holidayapi.com/
//https://app.abstractapi.com/api/holidays/

export const fetchCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Countries`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status:
                ${response.status}`);
    }

    const countries = await response.json();
    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const fetchHolidays = async (countryIsoCode) => {
  try {
    const currentYear = new Date().getFullYear();

    const url = new URL(`${API_BASE_URL}/`);

    url.searchParams.append("countryIsoCode", countryIsoCode);
    url.searchParams.append("year", currentYear);
    url.searchParams.append("languageIsoCode", "EN");
    url.searchParams.append("ValidFrom", `${currentYear}-01-01`);
    url.searchParams.append("ValidTo", `${currentYear}-12-31`);

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status:
                ${response.status}`);
    }
    const holidays = await response.json();
    return holidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    throw error;
  }
};

// const API_BASE_URL = "https://openholidaysapi.org/api/v1";
// console.log("Full API URL:", `${API_BASE_URL}/Countries`);
// // Helper function to handle API responses
// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//   }
//   return response.json();
// };

// const FALLBACK_COUNTRIES = [
//   { isoCode: "NLD", name: "Netherlands" },
//   { isoCode: "DEU", name: "Germany" },
//   { isoCode: "USA", name: "United States" }
// ];

// export const fetchCountries = async () => {
//   try {
//     //console.log("Attempting to fetch countries...");

//     const response = await fetch(`${API_BASE_URL}/Countries`, {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'User-Agent':'HolidayApp/1.0',

//       }
//     });

// if(response.staus === 404){
//   throw new Error('Rate limited or unauthorized');
// }

//     return await handleResponse(response);
//   } catch (error) {
//     console.error("API Error:", error);
//     throw new Error(`Failed to fetch countries: ${error.message}`);
//   }
// };

// export const fetchHolidays = async (countryCode) => {
//   try {
//     const currentYear = new Date().getFullYear();
//     const url = new URL(`${API_BASE_URL}/PublicHolidays`);

//     url.searchParams.append('countryIsoCode', countryCode);
//     url.searchParams.append('languageIsoCode', 'EN');
//     url.searchParams.append('validFrom', `${currentYear}-01-01`);
//     url.searchParams.append('validTo', `${currentYear}-12-31`);

//     const response = await fetch(url);
//     return await handleResponse(response);
//   } catch (error) {
//     console.error("API Error:", error);
//     throw new Error(`Failed to fetch holidays: ${error.message}`);
//   }
// };
