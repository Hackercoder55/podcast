import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioContext';

const Player: React.FC = () => {
  const { playerState, togglePlayPause, seek } = useAudioPlayer();
  const { isPlaying, currentPodcast, duration, currentTime } = playerState;
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Show player when a podcast is selected
    if (currentPodcast) {
      setShowPlayer(true);
    }
  }, [currentPodcast]);

  useEffect(() => {
    // Find audio element and apply volume settings
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    } else {
      // Try to find the audio element in the DOM
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioRef.current = audioElement;
        audioElement.volume = isMuted ? 0 : volume;
      }
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  if (!showPlayer) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t 
                   border-gray-800 text-white z-50 transition-all duration-500 
                   ${currentPodcast ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Podcast info */}
          <div className="flex items-center space-x-3 w-full md:w-1/4">
            {currentPodcast?.imageUrl && (
              <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={currentPodcast.imageUrl} 
                  alt={currentPodcast.title} 
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-col overflow-hidden">
              <h4 className="font-medium text-sm text-white truncate">
                {currentPodcast?.title}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {currentPodcast?.categories.join(', ')}
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col w-full md:w-2/4 space-y-1">
            <div className="flex items-center justify-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipBack size={18} />
              </button>
              
              <button 
                onClick={togglePlayPause}
                className={`p-2 rounded-full ${
                  isPlaying 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-900'
                } transition-all duration-300`}
              >
                {isPlaying 
                  ? <Pause size={18} /> 
                  : <Play size={18} className="ml-0.5" />
                }
              </button>
              
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipForward size={18} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              
              <div className="relative flex-grow h-1 bg-gray-700 rounded-full overflow-hidden group">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
                
                <div 
                  className="absolute top-1/2 h-3 w-3 bg-white rounded-full shadow 
                           -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ 
                    left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)`,
                    display: duration ? 'block' : 'none'
                  }}
                />
              </div>
              
              <span className="text-xs text-gray-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          
          {/* Volume */}
          <div className="flex items-center space-x-2 w-full md:w-1/4 justify-end">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            
            <div className="relative w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              <div 
                className="h-full bg-gray-400"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;