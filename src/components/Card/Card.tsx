import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Card.module.css';
import { FaTimes } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';  

interface CardProps {
  city: string;
  onRemove: (city: string) => void;
}

interface WeatherData {
  temp_c: number;
  condition: { text: string; icon: string };
}

const Card: React.FC<CardProps> = ({ city, onRemove }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Обработчик свайпа
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => onRemove(city), 
  });

  useEffect(() => {
    const fetchWeather = async () => {
      const cachedWeather = localStorage.getItem(`weather_${city}`);
      if (cachedWeather) {
        setWeather(JSON.parse(cachedWeather));
        return;
      }

      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${city}`
        );
        const data = {
          temp_c: response.data.current.temp_c,
          condition: response.data.current.condition,
        };
        setWeather(data);
        localStorage.setItem(`weather_${city}`, JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <div className={styles.card} {...swipeHandlers}>  
      <button className={styles.closeButton} onClick={() => onRemove(city)}>
        <FaTimes />
      </button>
      <h3>{city}</h3>
      {weather ? (
        <div className={styles.weatherInfo}>
          <p className={styles.temp}>{weather.temp_c}°C</p>
          <img
            src={weather.condition.icon}
            alt={weather.condition.text}
            className={styles.icon}
          />
          <p className={styles.condition}>{weather.condition.text}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Card;