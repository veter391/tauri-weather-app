import { useEffect, useState } from 'react';
import Titlebar from './components/titlebar';
import Sun from './components/sun';
import Moon from './components/moon';
import Container from './components/container';

function App() {
  const [theme, setTheme] = useState(false);
  const [userTheme, setUserTheme] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // check if user was changed the theme, of not change automatically checking current time
    if (!userTheme) {
      const timerID = setInterval(() => {
        setTime(new Date());
      }, 10000); // Update time every 10s
  
      if (time.getHours() >= 19 ) {
        setTheme(true);
      }
  
      // Clearing the timer when unmounting a component
      return () => {
        clearInterval(timerID);
      };
    }
  }, [time]);


  return (
    <div className={`wrapper ${theme ? 'dark' : null}`}>
      <div className="stars"></div>
      <Sun />
      <Moon />
      <Titlebar />
      <Container theme={theme} setTheme={setTheme} userTheme={setUserTheme} time={time} />
    </div>
  );
}


export default App;
