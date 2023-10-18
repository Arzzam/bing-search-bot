import { useEffect, useState } from "react";
import { getAllSearchQueries } from "./client";

function App() {
  const [numSearches, setNumSearches] = useState<string>("10");
  const [delayTime, setDelayTime] = useState<string>("5");
  const [data, setData] = useState<string[]>([]);

  async function fetchSearchQueries() {
    const searchQueriesObject = await getAllSearchQueries();
    const searchQueries: string[] = searchQueriesObject.map(
      (query) => query.search_query
    );
    setData(searchQueries);
  }

  useEffect(() => {
    fetchSearchQueries();
  }, []);

  function getRandomSearchQuery(): string {
    const randomIndex = Math.floor(Math.random() * data.length);
    console.log("data random index", data[randomIndex]);
    return data[randomIndex];
  }

  let searchTimeouts: NodeJS.Timeout[] = [];
  const scheduleSearches = () => {
    if (!numSearches || !delayTime) {
      alert("Please enter both number of searches and delay time.");
      return;
    }

    const numSearchesInt: number = parseInt(numSearches, 10);
    const delayTimeInt: number = parseInt(delayTime, 10);

    searchTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });

    for (let i = 0; i < numSearchesInt; i++) {
      const timeoutId = setTimeout(() => {
        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(
          getRandomSearchQuery()
        )}`;
        window.open(searchUrl, "_blank");
        // if (newTab) {
        //   newTab.focus();
        //   newTab.onfocus = () => {
        //     newTab.close();
        //   };
        // }
      }, i * delayTimeInt * 1000);
      searchTimeouts.push(timeoutId);
    }
  };

  const stopSearches = () => {
    alert("Stopping searches");
    searchTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    searchTimeouts = [];
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
        min={4}
        max={20}
        onChange={(e) => setDelayTime(e.target.value)}
        required
      />
      <br />
      <div className="button-grp">
        <button onClick={scheduleSearches}>Start Searches</button>
        <button onClick={stopSearches}>Stop Searches</button>
      </div>
    </div>
  );
}

export default App;
