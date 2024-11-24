
import styles from './App.module.css';
import Header from './components/Header/Header';
import WeatherList from './components/WeatherList/WeatherList';

const App = () => {
  return (
    <div className={styles.app}>
      <Header />
      <WeatherList />
    </div>
  );
};

export default App;