export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  origin: string;
  popularity: 'Alta' | 'Media' | 'Baja';
  tags: string[];
  memes: string[];
}

export interface Stats {
  totalCharacters: number;
  mostPopular: Character;
  seriesCount: { name: string; count: number }[];
}