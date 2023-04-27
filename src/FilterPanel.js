import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterPanel.css';

const FilterPanel = ({
  activeFilter,
  setActiveFilter,
  handleOptionClick,
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({ type: null, value: null });
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [uniqueCurrencies, setUniqueCurrencies] = useState([]);
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [uniqueSubRegions, setUniqueSubRegions] = useState([]);

  const togglePanel = () => {
    setPanelOpen(!panelOpen);
  };

  const handleConfirm = () => {
    if (selectedFilter.type && selectedFilter.value) {
      handleOptionClick(selectedFilter.type, selectedFilter.value);
    }
    setPanelOpen(false);
  };

  const handleFilterClick = (filterType, value) => {
    setSelectedFilter({ type: filterType, value });
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
        console.error('Error fetching currenciess:', error);
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
                {uniqueLanguages.map(({ language, code }, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleFilterClick('language', code);
                    }}
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
                {uniqueCurrencies.map((currency, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleFilterClick('currency', currency);
                    }}
                  >
                    {currency}
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
                      handleFilterClick('region', subregion);
                    }}
                  >
                    {subregion}
                  </li>
                ))}
              </ul>
            )}

            <button onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
