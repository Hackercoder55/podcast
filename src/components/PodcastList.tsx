import React from 'react';
import PodcastCard from './PodcastCard';
import { Podcast } from '../types/types';

interface PodcastListProps {
  podcasts: Podcast[];
  searchTerm: string;
  selectedCategory: string;
}

const PodcastList: React.FC<PodcastListProps> = ({ 
  podcasts, 
  searchTerm, 
  selectedCategory 
}) => {
  // Filter podcasts based on search term and selected category
  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || podcast.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (filteredPodcasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-gray-400 text-lg mb-2">No podcasts found</div>
        <p className="text-gray-500 text-sm text-center max-w-md">
          Try adjusting your search or category filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredPodcasts.map(podcast => (
        <div key={podcast.id} className="h-full">
          <PodcastCard podcast={podcast} />
        </div>
      ))}
    </div>
  );
};

export default PodcastList;