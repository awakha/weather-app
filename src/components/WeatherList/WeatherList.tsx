import React, { useState } from 'react';
import styles from './WeatherList.module.css';
import SearchBar from '../SearchBar/SearchBar';
import Card from '../Card/Card';

const WeatherList = () => {
  const [cities, setCities] = useState<string[]>([]);

  const addCity = (city: string) => {
    if (!cities.includes(city)) {
      setCities([...cities, city]);
    }
  };

  const removeCity = (city: string) => {
    setCities(cities.filter(c => c !== city));
  };

  return (
    <div>
      <SearchBar onAddCity={addCity} />
      <div className={styles.list}>
        {cities.map(city => (
          <Card key={city} city={city} onRemove={removeCity} />
        ))}
      </div>
    </div>
  );
};

export default WeatherList;