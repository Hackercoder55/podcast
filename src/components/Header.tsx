import React, { useState } from 'react';
import { Headphones, Search } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import { useAudioPlayer } from '../context/AudioContext';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const Header: React.FC<HeaderProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  categories
}) => {
  const { playerState } = useAudioPlayer();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener to change header style when scrolled
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-r from-purple-900/70 to-gray-900/70'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Headphones className="h-8 w-8 text-cyan-400 mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              PodWave
            </h1>
          </div>
          
          {playerState.currentPodcast && (
            <div className="hidden md:flex items-center text-gray-300">
              <span className="text-sm mr-2">Now Playing:</span>
              <span className="text-sm font-medium truncate max-w-[200px]">
                {playerState.currentPodcast.title}
              </span>
            </div>
          )}
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search podcasts..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>
            
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;