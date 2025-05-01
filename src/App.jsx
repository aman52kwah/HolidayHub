
import CountrySelector from './components/CountrySelector'
import './App.css'

function App() {


  return (
    <>
      
      <CountrySelector
                  countries={countries}
                  selectedCountry={selectedCountry}
                  isLoading={isLoadingCountries}
                  onSelectCountry={handleCountryChange}
                />
      
    </>
  )
}

export default App
