import { useEffect, useState } from "react";
import { getAllSearchQueries } from "./client";

function App() {
  const [numSearches, setNumSearches] = useState<string>("10");
  const [delayTime, setDelayTime] = useState<string>("5");
  const [data, setData] = useState<string[]>([]);

  async function fetchSearchQueries() {
    const searchQueries = await getAllSearchQueries();
    setData(searchQueries);
  }

  useEffect(() => {
    fetchSearchQueries();
  }, []);

  function getRandomSearchQuery(): string {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }

  const scheduleSearches = () => {
    if (!numSearches || !delayTime) {
      alert("Please enter both number of searches and delay time.");
      return;
    }

    const numSearchesInt: number = parseInt(numSearches, 10);
    const delayTimeInt: number = parseInt(delayTime, 10);

    for (let i = 0; i < numSearchesInt; i++) {
      setTimeout(() => {
        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(
          getRandomSearchQuery()
        )}`;
        window.open(searchUrl, "_blank");
      }, i * delayTimeInt * 1000);
    }
  };

  return (
    <div className="App">
      <label htmlFor="numSearches">Number of Searches:</label>
      <input
        type="number"
        id="numSearches"
        value={numSearches}
        min={1}
        max={30}
        onChange={(e) => setNumSearches(e.target.value)}
        required
      />
      <br />
      <label htmlFor="delayTime">Delay Time (in seconds):</label>
      <input
        type="number"
        id="delayTime"
        value={delayTime}
        min={1}
        max={30}
        onChange={(e) => setDelayTime(e.target.value)}
        required
      />
      <br />
      <button onClick={scheduleSearches}>Start Searches</button>
    </div>
  );
}

export default App;
