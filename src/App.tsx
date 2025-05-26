import { useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { getAllSearchQueries } from './data/client';
import Input from './components/Input';
import Button from './components/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalContainer from './components/Modal';

function App() {
  const [numSearches, setNumSearches] = useState<string>('10');
  const [data, setData] = useState<string[]>([]);
  const [searchQueryWindowSet, setSearchQueryWindowSet] = useState<Set<Window>>(
    new Set<Window>()
  );
  const [searchQuerySet, setSearchQuerySet] = useState<Set<string>>(
    new Set<string>()
  );
  const isSearchingRef = useRef<boolean>(false);

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

  const simulateSearch = async () => {
    const delay = Math.floor(Math.random() * 5000) + 5000; // Random delay between 5 to 10 seconds
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  function getRandomSearchQuery(): string {
    const randomIndex = Math.floor(Math.random() * data.length + 1);
    if (searchQuerySet.has(data[randomIndex])) {
      return getRandomSearchQuery();
    } else {
      return data[randomIndex];
    }
  }

  const scheduleSearches = async () => {
    if (!numSearches) {
      toast.info('Please enter both number of searches and delay time.');
      return;
    }
    if (data && data.length > 0) {
      const numSearchesInt = parseInt(numSearches, 10);
      // const delayTimeInt = parseInt(delayTime, 10);
      isSearchingRef.current = true;
      toast(
        `Bing searches have been initiated with ${numSearchesInt} searches.`
      );

      for (let i = 0; i < numSearchesInt; i++) {
        if (!isSearchingRef.current) {
          break;
        }
        const searchQuery = getRandomSearchQuery();
        await simulateSearch();
        const searchUrl = `https://www.bing.com/search?pglt=2083&q=${encodeURIComponent(
          searchQuery
        )}&FORM=ANNTA1&PC=U531`;

        const newTab =
          isSearchingRef.current && window.open(searchUrl, '_blank');
        if (newTab) {
          setSearchQueryWindowSet((prev) => prev.add(newTab as Window));
          setSearchQuerySet((prev) => prev.add(searchUrl));
        }
      }
      isSearchingRef.current = false;
      toast.success('All searches have been completed.', { autoClose: false });
    } else {
      toast.error('No search queries found. Error in fetching data.');
    }
  };

  const handleNumSearchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setNumSearches('');
    } else {
      const num = parseInt(value, 10);
      if (num >= 1 && num <= 50) {
        setNumSearches(value);
      }
    }
  };

  const stopSearches = () => {
    if (searchQueryWindowSet.size < 1) {
      toast('No searches are running.');
      return;
    }
    if (searchQueryWindowSet.size > 0) {
      isSearchingRef.current = false;
      toast('Upcoming all searches have been stopped.');
    }
  };

  const closeAllTabsHandler = () => {
    if (searchQueryWindowSet.size < 1) {
      toast('No tabs are open.');
      return;
    }
    if (searchQueryWindowSet.size > 0) {
      toast('All tabs are closed.');
    }
    searchQueryWindowSet.forEach((searchQuery) => {
      searchQuery.close();
    });
    setSearchQueryWindowSet(new Set<Window>());
  };

  return (
    <>
      <div className="font-sans flex flex-col items-center justify-center h-[calc(100vh-56px)] gap-4">
        <ToastContainer />
        <h1 className="text-center text-4xl font-bold text-orange-300">
          Bing Search Bot
        </h1>
        <Input
          label="Number of Searches:"
          type="number"
          id="numSearches"
          value={numSearches}
          min={1}
          max={50}
          onChange={handleNumSearchesChange}
        />
        <div className="flex justify-between gap-2 flex-row">
          <Button onClick={scheduleSearches} disabled={isSearchingRef.current}>
            Start Searches
          </Button>
          <Button onClick={stopSearches}>Stop Searches</Button>
        </div>
        <Button onClick={closeAllTabsHandler}>Close all Tabs</Button>
        <ModalContainer />
      </div>
      <footer className="text-center text-sm text-white flex flex-col justify-center items-center p-2">
        <span>
          Made with ❤️ by{' '}
          <a
            className="text-orange-300 cursor-pointer hover:text-orange-400"
            href="https://github.com/Arzzam"
            target="_blank"
            rel="noopener noreferrer"
          >
            Arzzam
          </a>
        </span>
        <div className="flex items-center justify-center">
          <span className="text-orange-300">
            Give a ⭐ on GitHub if you liked it!
          </span>
          <a
            href="https://github.com/Arzzam/bing-search-bot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="ml-1 text-white hover:text-orange-300 w-4 h-4 cursor-pointer"
              onClick={() =>
                window.open(
                  'https://github.com/Arzzam/bing-search-bot',
                  '_blank'
                )
              }
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>
      </footer>
      <Analytics />
    </>
  );
}

export default App;
