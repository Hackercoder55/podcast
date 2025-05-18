import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Podcast, AudioPlayerState } from '../types/types';

interface AudioContextType {
  playerState: AudioPlayerState;
  playPodcast: (podcast: Podcast) => void;
  pausePodcast: () => void;
  seek: (time: number) => void;
  togglePlayPause: () => void;
}

const defaultState: AudioPlayerState = {
  isPlaying: false,
  currentPodcast: null,
  duration: 0,
  currentTime: 0
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerState, setPlayerState] = useState<AudioPlayerState>(defaultState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const updateTime = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audio.currentTime
      }));
    };
    
    const updateDuration = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: audio.duration
      }));
    };
    
    const handleEnded = () => {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0
      }));
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const playPodcast = (podcast: Podcast) => {
    if (audioRef.current) {
      // If trying to play the same podcast that's already playing, just return
      if (playerState.currentPodcast?.id === podcast.id && playerState.isPlaying) {
        return;
      }
      
      // If switching to a new podcast
      if (playerState.currentPodcast?.id !== podcast.id) {
        audioRef.current.src = podcast.audioUrl;
        audioRef.current.currentTime = 0;
      }
      
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      
      setPlayerState({
        isPlaying: true,
        currentPodcast: podcast,
        duration: audioRef.current.duration || 0,
        currentTime: audioRef.current.currentTime
      });
    }
  };

  const pausePodcast = () => {
    if (audioRef.current && playerState.isPlaying) {
      audioRef.current.pause();
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false
      }));
    }
  };

  const togglePlayPause = () => {
    if (playerState.isPlaying) {
      pausePodcast();
    } else if (playerState.currentPodcast) {
      playPodcast(playerState.currentPodcast);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current && playerState.currentPodcast) {
      audioRef.current.currentTime = time;
      setPlayerState(prev => ({
        ...prev,
        currentTime: time
      }));
    }
  };

  return (
    <AudioContext.Provider
      value={{
        playerState,
        playPodcast,
        pausePodcast,
        seek,
        togglePlayPause
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};