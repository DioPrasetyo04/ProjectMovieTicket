export interface Movie {
  title: string;
  // foreign key ke model dan table genre
  slug?: string;
  genre: string;
  theaters: string[];
  description: string;
  thumbnail: string;
  video_trailer?: string;
  price: number;
  available: boolean;
  bonus: string;
}
