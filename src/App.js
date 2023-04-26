import React, { useState} from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './App.css';

function App() {
  const [countryInput, setCountryInput] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [filter, setFilter] = useState('');

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      return new Promise((resolve) => {
        timeout = setTimeout(() => resolve(func.apply(context, args)), wait);
      });
    };
  };

  const handleFilterClick = (filterType) => {
    setFilter(filterType);
  };


  const handleSubmit = async (event, country) => {
    event.preventDefault();

    if (!country && !countryInput) {
      return;
    }

    try {
      let response;
      if (filter) {
        response = await axios.get(`http://localhost:5000/api/country/${filter}/${country || countryInput}`);
      } else {
        response = await axios.get(`http://localhost:5000/api/country/${country || countryInput}`);
      }
      setCountryData(response.data);
      setErrorMessage('');
      setCountryInput('');
  
      
      setGoogleMapsLink(`https://maps.google.com/maps?q=${response.data.latlng[0]},${response.data.latlng[1]}&z=5&output=embed`);
    } catch (error) {
      console.error('Error fetching country data:', error);
      setErrorMessage(
        `Error fetching data for "${country || countryInput}". Please try again.`
      );
    }
  };
  
  


  const handleKeyPress = (event) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  };

  const getSuggestions = async (value) => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${value}`);
      return response.data.map((country) => country.name.common).slice(0, 5);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const debouncedGetSuggestions = debounce(getSuggestions, 300);

  const onSuggestionsFetchRequested = async ({ value }) => {
    const suggestions = await debouncedGetSuggestions(value);
    setSuggestions(suggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion, { query }) => {
    const indexOfMatch = suggestion.toLowerCase().indexOf(query.toLowerCase());
    const firstHalf = suggestion.slice(0, indexOfMatch);
    const middle = suggestion.slice(indexOfMatch, indexOfMatch + query.length);
    const secondHalf = suggestion.slice(indexOfMatch + query.length);
  
    return (
      <div>
        {firstHalf}
        <strong>{middle}</strong>
        {secondHalf}
      </div>
    );
  };
  

  const handleSuggestionSelected = (event, { suggestion }) => {
    setCountryInput(suggestion);
    handleSubmit(event, suggestion);
  };

  const inputProps = {
    placeholder: 'Enter country name',
    value: countryInput,
    onChange: (_, { newValue }) => {
      setCountryInput(newValue.replace(/[^a-zA-Z\s]/g, ''));
    },
    onKeyDown: handleKeyPress,
  };

  return (
    <div className="container">
      <h1>Country Information</h1>
      <div className="search-form">
        <form onSubmit={handleSubmit}>
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            shouldRenderSuggestions={() => true}
            onSuggestionSelected={handleSuggestionSelected}/>
          <button type="submit">Get Data</button>
        </form >
      </div>

      <div>
        <button onClick={() => handleFilterClick('language')}>Language</button>
        <button onClick={() => handleFilterClick('currency')}>Currency</button>
        <button onClick={() => handleFilterClick('region')}>Region</button>
        <button onClick={() => handleFilterClick('subregion')}>Sub-region</button>
      </div>

      {errorMessage && (
        <div className={`error-message${errorMessage ? ' visible' : ''}`}>
          {errorMessage}
        </div>
      )}
      
      {countryData && (
        <div className="country-data">
          <div className="country-flag">
            
            <img src={countryData.flag} 
              alt={`${countryData.flag_alt} flag`} 
              style={{ marginRight: "10px", verticalAlign: "middle", border: "2px solid", borderRadius: "10px"  
            }}/>

          </div>
          <h2>
            {countryData.name}
          </h2>
          <p>
            <strong>Capital:</strong> {countryData.capital}
          </p>
          <p>
            <strong>Population:</strong> {countryData.population.toLocaleString()}
          </p>
          <p>
            <strong>Area:</strong> {countryData.area.toLocaleString()} km²
          </p>
          <p></p>
          {countryData.officialName && (
            <p>
              <strong>Official Name:</strong> {countryData.officialName}
            </p>
          )}
          {countryData.nativeNames && (
            <div>
              <strong>Native Names:</strong>
              <ul>
                {Object.entries(countryData.nativeNames).map(([key, value]) => (
                  <li key={key}>
                    {value.common} ({value.official})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {countryData.languages && (
            <div>
              <strong>Languages:</strong>
              <ul>
                {Object.entries(countryData.languages).map(([key, value]) => (
                  <li key={key}>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {countryData.currency && (
            <p>
              <strong>Currency:</strong> {countryData.currency.name} ({countryData.currency.symbol})
            </p>
          )}

          {googleMapsLink && (
            <div style={{ width: '100%', height: '400px', marginBottom: '20px' }}>
              <iframe
                title="Google Maps"
                width="100%"
                height="100%"
                frameBorder="0"
                src={googleMapsLink}
                allowFullScreen
              ></iframe>
            </div>
          )}


        </div>
      )}

      
    </div>
    
  );
}

export default App;
