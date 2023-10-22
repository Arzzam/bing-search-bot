import { useEffect, useState } from 'react';
import { getAllSearchQueries } from './data/client';
import Input from './components/Input';
import Button from './components/Button';

function App() {
  const [numSearches, setNumSearches] = useState<string>('10');
  const [delayTime, setDelayTime] = useState<string>('4');
  const [data, setData] = useState<string[]>([]);
  const [searchQueryWindowSet, setSearchQueryWindowSet] = useState<Set<Window>>(
    new Set<Window>()
  );
  const [searchQuerySet, setSearchQuerySet] = useState<Set<string>>(
    new Set<string>()
  );

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
    console.log('data random index', data[randomIndex]);
    if (searchQuerySet.has(data[randomIndex])) {
      return getRandomSearchQuery();
    } else {
      return data[randomIndex];
    }
  }

  let searchTimeouts: NodeJS.Timeout[] = [];

  const scheduleSearches = () => {
    if (!numSearches || !delayTime) {
      alert('Please enter both number of searches and delay time.');
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
        const newTab = window.open(searchUrl, '_blank');
        if (newTab) {
          setSearchQueryWindowSet((prev) => prev.add(newTab as Window));
          setSearchQuerySet((prev) => prev.add(searchUrl));
        }
      }, i * delayTimeInt * 1000);
      searchTimeouts.push(timeoutId);
    }
  };

  const stopSearches = () => {
    alert('Stopping searches');
    searchTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    searchTimeouts = [];
  };

  const handleNumSearchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setNumSearches('');
    } else {
      const num = parseInt(value, 10);
      if (num >= 1 && num <= 30) {
        setNumSearches(value);
      }
    }
  };

  const handleDelayTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setDelayTime('');
    } else {
      const num = parseInt(value, 10);
      if (num >= 4 && num <= 20) {
        setDelayTime(value);
      }
    }
  };

  const closeAllTabsHandler = () => {
    searchQueryWindowSet.forEach((searchQuery) => {
      searchQuery.close();
    });
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-center text-4xl font-bold text-orange-300">
        Bing Search Bot
      </h1>
      <Input
        label="Number of Searches:"
        type="number"
        id="numSearches"
        value={numSearches}
        min={1}
        max={30}
        onChange={handleNumSearchesChange}
        required
      />
      <Input
        label="Delay Time (in seconds):"
        id="delayTime"
        value={delayTime}
        min={4}
        max={20}
        onChange={handleDelayTimeChange}
        required
      />
      <div className="flex justify-between gap-2 flex-row">
        <Button onClick={scheduleSearches}>Start Searches</Button>
        <Button onClick={stopSearches}>Stop Searches</Button>
      </div>
      <Button onClick={closeAllTabsHandler}>Close all Tabs</Button>
    </div>
  );
}

export default App;
