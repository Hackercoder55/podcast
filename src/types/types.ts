export interface Podcast {
  id: string;
  title: string;
  description: string;
  duration: string;
  releaseDate: string;
  audioUrl: string;
  imageUrl: string;
  categories: string[];
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentPodcast: Podcast | null;
  duration: number;
  currentTime: number;
}