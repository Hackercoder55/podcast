import React from 'react';
import { Play, Pause, Clock, Calendar } from 'lucide-react';
import { Podcast } from '../types/types';
import { useAudioPlayer } from '../context/AudioContext';

interface PodcastCardProps {
  podcast: Podcast;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  const { playerState, playPodcast, pausePodcast } = useAudioPlayer();
  const isPlaying = playerState.isPlaying && playerState.currentPodcast?.id === podcast.id;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pausePodcast();
    } else {
      playPodcast(podcast);
    }
  };

  return (
    <div className="group relative h-full bg-gradient-to-br from-gray-800/50 to-gray-900/90 
                  backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-800 
                  hover:border-purple-700/30 transition-all duration-300 transform hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70 z-10"></div>
      
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={podcast.imageUrl} 
          alt={podcast.title} 
          className="w-full h-full object-cover transition-transform duration-500 
                   group-hover:scale-105"
        />
      </div>
      
      <div className="relative z-20 p-4">
        <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">{podcast.title}</h3>
        
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{podcast.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1 text-xs text-gray-400">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{podcast.duration}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formatDate(podcast.releaseDate)}</span>
            </div>
          </div>
          
          <button
            onClick={handlePlayPause}
            className={`flex items-center justify-center rounded-full w-12 h-12 
                      ${isPlaying 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white text-gray-900'
                      } 
                      shadow-lg group-hover:scale-105 transition-all duration-300 
                      ${isPlaying ? 'shadow-purple-500/30' : ''}`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying 
              ? <Pause className="w-5 h-5" /> 
              : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            }
          </button>
        </div>
        
        {podcast.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {podcast.categories.slice(0, 2).map((category) => (
              <span 
                key={category}
                className="inline-block px-2 py-0.5 text-xs font-medium rounded-full 
                         bg-gray-700/70 text-gray-300"
              >
                {category}
              </span>
            ))}
            {podcast.categories.length > 2 && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full 
                             bg-gray-700/70 text-gray-300">
                +{podcast.categories.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      
      {isPlaying && (
        <div className="absolute top-2 right-2 z-30 flex items-center justify-center bg-purple-600 
                      text-white text-xs rounded-full px-2 py-1 font-medium">
          Now Playing
        </div>
      )}
    </div>
  );
};

export default PodcastCard;