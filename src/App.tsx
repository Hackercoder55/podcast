import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PodcastList from './components/PodcastList';
import Player from './components/Player';
import { AudioProvider } from './context/AudioContext';
import { podcasts } from './data/podcastData';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Extract unique categories from podcasts
  useEffect(() => {
    const allCategories = podcasts.flatMap(podcast => podcast.categories);
    const uniqueCategories = [...new Set(allCategories)];
    setCategories(uniqueCategories);
  }, []);
  
  return (
    <AudioProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {selectedCategory ? `${selectedCategory} Podcasts` : 'Featured Podcasts'}
            </h2>
            <p className="text-gray-400">
              {searchTerm 
                ? `Search results for "${searchTerm}"` 
                : 'Discover and listen to amazing podcast episodes'}
            </p>
          </div>
          
          <PodcastList 
            podcasts={podcasts} 
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />
        </main>
        
        <div className="pb-24"></div> {/* Spacer for the player */}
        <Player />
      </div>
    </AudioProvider>
  );
}

export default App;