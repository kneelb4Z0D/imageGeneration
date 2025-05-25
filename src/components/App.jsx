import React, { useState} from 'react';
import './App.css';

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

  const searchImages = async () => {
    if (!accessKey) {
      console.error('Missing Unsplash Access Key');
      return;
    }

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Check if data.results is an array before using it
      if (Array.isArray(data.results)) {
        setResults((prevResults) =>
          page === 1 ? data.results : [...prevResults, ...data.results]
        );
      } else {
        console.error('Invalid response format:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    searchImages();
  };

  const handleShowMore = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      searchImages();
      return nextPage;
    });
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Image Search Engine</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your queries here..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div id="search-result">
        {Array.isArray(results) &&
          results.map((result) => (
            <a
              key={result.id}
              href={result.links.html}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={result.urls.small}
                alt={result.alt_description || 'Unsplash image'}
              />
            </a>
          ))}
      </div>

      {Array.isArray(results) && results.length > 0 && (
        <button id="show-more-btn" onClick={handleShowMore}>
          Show more
        </button>
      )}
    </div>
  );
};

export default App;
