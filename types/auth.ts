import { User } from '@supabase/supabase-js';
import { ImageSourcePropType } from 'react-native';

export interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isGuest: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  username: string;
}

export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

export interface AuthError {
  message: string;
  code?: string;
}
