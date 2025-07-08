export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  title: string;
  description: string;
  duration: number;
  calories_burned: number;
  created_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  workout_id: string;
  date: string;
  metrics: {
    weight?: number;
    reps?: number;
    sets?: number;
    distance?: number;
  };
}

export interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes: number;
  created_at: string;
}
