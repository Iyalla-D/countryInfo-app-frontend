import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterPanel.css';

const FilterPanel = ({
  activeFilter,
  setActiveFilter,
  handleOptionClick,
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [uniqueCurrencies, setUniqueCurrencies] = useState([]);
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [uniqueSubRegions, setUniqueSubRegions] = useState([]);

  const togglePanel = () => {
    setPanelOpen(!panelOpen);
  };

  const handleConfirm = () => {
    if (selectedFilters.length > 0) {
      handleOptionClick(selectedFilters);
    }
    setPanelOpen(false);
  };

  const handleClear = () => {
    setSelectedFilters([]);
  };

  const handleFilterClick = (filterType, value) => {
    const filter = { type: filterType, value };
    const index = selectedFilters.findIndex(
      (f) => f.type === filterType && f.value === value
    );
    if (index === -1) {
      setSelectedFilters([...selectedFilters, filter]);
    } else {
      setSelectedFilters([
        ...selectedFilters.slice(0, index),
        ...selectedFilters.slice(index + 1),
      ]);
    }
  };

  useEffect(() => {
    const fetchAllLanguages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/languages');
        setUniqueLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    const fetchAllCurrencies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/currencies');
        setUniqueCurrencies(response.data);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    const fetchAllRegions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/regions');
        setUniqueRegions(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    const fetchAllSubRegions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/subregions');
        setUniqueSubRegions(response.data);
      } catch (error) {
        console.error('Error fetching subregions:', error);
      }
    };

    fetchAllLanguages();
    fetchAllCurrencies();
    fetchAllRegions();
    fetchAllSubRegions();
  }, []);

  return (
    <div>
      <button onClick={togglePanel}>Toggle Filter Panel</button>
      {panelOpen && (
        <div className="overlay">
          <div className="filter-panel-container">
            <button
              className={activeFilter === 'language' ? 'active-filter' : ''}
              onClick={() => setActiveFilter('language')}
            >
              Language
            </button>

            {activeFilter === 'language' && (
              <ul className="filter-list">
                {uniqueLanguages.map(({ code, language }, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleFilterClick('language', code);
                    }}
                    className={
                      selectedFilters.some(
                        (filter) => filter.type === 'language' && filter.value === code
                      )
                        ? 'selected'
                        : ''
                    }
                  >
                    {language}
                  </li>
                ))}
              </ul>
            )}

            <button
              className={activeFilter === 'currency' ? 'active-filter' : ''}
              onClick={() => setActiveFilter('currency')}
            >
              Currency
            </button>

            {activeFilter === 'currency' && (
              <ul className="filter-list">
                {uniqueCurrencies.map(({code, name, symbol}, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleFilterClick('currency', code);
                    }}
                    className={
                      selectedFilters.some(
                        (filter) => filter.type === 'currency' && filter.value === code
                      )
                        ? 'selected'
                        : ''
                    }
                  >
                    {name} ({symbol})
                  </li>
                ))}
              </ul>
            )}

            <button
              className={activeFilter === 'region' ? 'active-filter' : ''}
              onClick={() => setActiveFilter('region')}
            >
              Region
            </button>

            {activeFilter === 'region' && (
              <ul className="filter-list">
                {uniqueRegions.map((region, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleFilterClick('region', region);
                    }}
                    className={
                      selectedFilters.some(
                        (filter) => filter.type === 'region' && filter.value === region
                      )
                        ? 'selected'
                        : ''
                    }
                  >
                    {region}
                  </li>
                ))}
              </ul>
            )}

            <button
              className={activeFilter === 'subregion' ? 'active-filter' : ''}
              onClick={() => setActiveFilter('subregion')}
            >
              Sub-region
            </button>

            {activeFilter === 'subregion' && (
              <ul className="filter-list">
                {uniqueSubRegions.map((subregion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleFilterClick('subregion', subregion);
                    }}
                    className={
                      selectedFilters.some(
                        (filter) => filter.type === 'subregion' && filter.value === subregion
                      )
                        ? 'selected'
                        : ''
                    }
                  >
                    {subregion}
                  </li>
                ))}
              </ul>
            )}

            <button onClick={handleClear}>Clear</button>
            <button onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
