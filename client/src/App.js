import React from 'react';
import ShortenerForm from './components/ShortenerForm';

function App() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">URL Shortener</h1>
      <ShortenerForm />
    </div>
  );
}

export default App;