import React, { useState , useEffect} from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import FilterPanel from "./FilterPanel";
import Display from './Display';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const [countryInput, setCountryInput] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [Empty, setEmpty] = useState(false);
  const [filterAttempted, setFilterAttempted] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  



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

  const handleOptionClick = async (filters) => {
    try {
      const queryParams = new URLSearchParams();
      filters.forEach((filter) => {
        queryParams.append(filter.type, filter.value);
      });
      const response = await axios.get(`http://localhost:5000/api/country/filter/filters?${queryParams}`);
      setFilteredCountries(response.data);
      setFilterAttempted(true);
      setSearchPerformed(true);
      
    } catch (error) {
      console.error('Error fetching countries by filters:', error);
    }
  };

  useEffect(() => {
    setEmpty(filteredCountries.length === 0);
  }, [filteredCountries]);


  useEffect(() => {
    if (searchPerformed) {
      document.body.classList.remove("disable-scroll");
    } else {
      document.body.classList.add("disable-scroll");
    }
  
    return () => {
      document.body.classList.remove("disable-scroll");
    };
  }, [searchPerformed]);
  
  
  

  const handleSubmit = async (event, country) => {
    if (event) {
      event.preventDefault();
    }

    if (!country && !countryInput) {
      return;
    }

    try {
      setShowOverlay(true);
      let response;
      response = await axios.get(`http://localhost:5000/api/country/${country || countryInput}`);
      setCountryData(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching country data:', error);
      setErrorMessage(
        `Error fetching data for "${country || countryInput}". Please try again.`
      );
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
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
    <div className={`container${searchPerformed ? ' hide-scrollbar' : ''}`}>
      <div className={`main-content${searchPerformed ? '' : ' centered'}`}>
        <h1>Country Information</h1>
        <div className="search-container">
        <div className="search-form">
          <form onSubmit={handleSubmit}>
          <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              shouldRenderSuggestions={(value) => value.trim().length > 0}
              onSuggestionSelected={handleSuggestionSelected}/>
            <button type="submit">View</button>
          </form >
        </div>

        <div>
          <FilterPanel
              handleOptionClick={handleOptionClick}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />      
        </div>
      </div>
      </div>
        
      
      
        
      
      <div>
        {showOverlay && (
          <Display countryData={countryData} onClose={handleCloseOverlay}/>
        )}
      </div>

      {errorMessage && (
        <div className={`error-message${errorMessage ? ' visible' : ''}`}>
          {errorMessage}
        </div>
      )}
      
      
      {filteredCountries.length > 0 && (
        <div>
          <h2>Filtered Countries</h2>
          <ul className="country-list">
          {filteredCountries
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .map((country, index) => (
              <li key={index} onClick={() => handleSubmit(null, country.name.common)} className="clickable-country">
                <i className="fa fa-info-circle" aria-hidden="true"></i> {country.name.common}
              </li>
          ))}
          </ul>
        </div>
      )}
      
      {Empty === true && filterAttempted &&(
        <div>
          <h2>No Filtered Countries</h2>
        </div>
      )}

    </div>
    
  );
}

export default App;
