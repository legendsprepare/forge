import { Json } from './supabase';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  is_online: boolean;
  last_active: string;
}

export interface Friendship {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  status: FriendshipStatus;
  follower?: UserProfile;
  following?: UserProfile;
}

export type FriendshipStatus = 'pending' | 'accepted';

export interface Activity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  content: Json;
  created_at: string;
  workout_id?: string;
  challenge_id?: string;
  achievement_id?: string;
}

export interface EnrichedActivity extends Activity {
  user: UserProfile;
}

export type ActivityType =
  | 'workout_completed'
  | 'achievement_unlocked'
  | 'challenge_joined'
  | 'challenge_completed'
  | 'friend_joined'
  | 'personal_record';

export interface TeamChallenge {
  id: string;
  name: string;
  description: string;
  created_by: string;
  start_date: string;
  end_date: string;
  challenge_type: string;
  target_value: number;
  reward_xp: number;
  status: string;
}

export interface EnrichedTeamChallenge extends TeamChallenge {
  creator: UserProfile;
  participants: UserProfile[];
  current_progress: number;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: string;
  created_by: string;
  created_at: string;
  challenge_id?: string;
  participants: UserProfile[];
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  type: string;
  reaction_count: number;
}

export interface EnrichedChatMessage extends ChatMessage {
  user: UserProfile;
}

export interface SocialNotification {
  id: string;
  user_id: string;
  type: string;
  content: Json;
  created_at: string;
  read_at?: string;
  related_user?: UserProfile;
}

export interface FriendSuggestion {
  user: UserProfile;
  mutualFriends: number;
  mutualAchievements: number;
}
