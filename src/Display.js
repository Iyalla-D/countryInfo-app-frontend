import React, {} from 'react';
import './Display.css';

const Display = ({ countryData, onClose }) => {

    return (
        <div className="overlay">
            <button className="close-btn" onClick={onClose}>
                X
            </button>

            <div className="country-data-container">
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

                        {countryData.latlng && (
                            <div style={{ width: '100%', height: '400px', marginBottom: '20px' }}>
                            <iframe
                                title="Google Maps"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                src={`https://maps.google.com/maps?q=${countryData.latlng[0]},${countryData.latlng[1]}&z=5&output=embed`}
                                allowFullScreen
                            ></iframe>
                            </div>
                        )}
                    </div>
                )}
            </div>
            

        </div>
    );
};



export default Display;