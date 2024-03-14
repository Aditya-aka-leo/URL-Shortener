import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const ShortenerForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const req = {
        original_url:originalUrl
      }
      console.log(req.original_url);
      const response = await axios.post('http://localhost:4000/url', {"original_url":originalUrl});
      console.log(response.data)
      setShortUrl(response.data);
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // cleanup
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto mt-8">
  <div className="mb-4">
    <label htmlFor="originalUrl" className="block text-gray-700 text-sm font-bold mb-2">
      Original URL
    </label>
    <input
      type="url"
      id="originalUrl"
      name="originalUrl"
      value={originalUrl}
      onChange={(e) => setOriginalUrl(e.target.value)}
      placeholder="Enter a long URL"
      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-primary-blue focus:ring-opacity-50 w-full"
      required
    />
  </div>
  <button
    type="submit"
    disabled={loading}
    className={`bg-primary-blue text-black py-2 px-4 rounded bg-blue-700 focus:outline-none focus:ring focus:ring-primary-blue focus:ring-opacity-50 ${
      loading ? 'cursor-not-allowed opacity-0' : ''
    }`}
  >
    {loading ? 'Shortening...' : 'Shorten URL'}
  </button>
  {shortUrl && (
    <div className="mt-4">
      <p className="font-semibold">Shortened URL:</p>
      <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">
        {shortUrl}
      </a>
      <button
        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={() => navigator.clipboard.writeText(shortUrl)}
      >
        Copy to Clipboard
      </button>
    </div>
  )}
</form>

  );
};

export default ShortenerForm;