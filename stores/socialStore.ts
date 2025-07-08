import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  UserProfile,
  Friendship,
  Activity,
  TeamChallenge,
  ChatRoom,
  ChatMessage,
  EnrichedActivity,
  EnrichedChatMessage,
  EnrichedTeamChallenge,
  SocialNotification,
  FriendSuggestion,
  FriendshipStatus,
  ActivityType,
} from "../types/social";
import { showMessage } from "react-native-flash-message";
import { playAchievementSound } from "../lib/sounds";
import { updateAvatarMood } from "../lib/avatar";

interface SocialState {
  // Profile and Friends
  userProfile: UserProfile | null;
  friends: UserProfile[];
  friendRequests: Friendship[];
  friendSuggestions: FriendSuggestion[];

  // Activity Feed
  activities: EnrichedActivity[];
  notifications: SocialNotification[];
  unreadNotifications: number;

  // Team Challenges
  activeTeamChallenges: EnrichedTeamChallenge[];
  pastTeamChallenges: EnrichedTeamChallenge[];

  // Chat
  chatRooms: ChatRoom[];
  currentChatRoom: ChatRoom | null;
  chatMessages: Record<string, EnrichedChatMessage[]>;
  unreadMessageCounts: Record<string, number>;

  // Subscriptions
  subscriptions: {
    activities?: RealtimeChannel;
    notifications?: RealtimeChannel;
    challenges?: RealtimeChannel;
    chat?: RealtimeChannel;
  };

  // Profile Actions
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Friend Actions
  sendFriendRequest: (targetUserId: string) => Promise<void>;
  acceptFriendRequest: (friendshipId: string) => Promise<void>;
  declineFriendRequest: (friendshipId: string) => Promise<void>;
  unfriend: (friendId: string) => Promise<void>;
  loadFriendSuggestions: () => Promise<void>;

  // Activity Actions
  createActivity: (
    type: ActivityType,
    content: any,
    metadata?: any
  ) => Promise<void>;
  loadActivities: () => Promise<void>;

  // Challenge Actions
  createTeamChallenge: (challenge: Partial<TeamChallenge>) => Promise<void>;
  joinTeamChallenge: (challengeId: string) => Promise<void>;
  updateChallengeProgress: (
    challengeId: string,
    progress: number
  ) => Promise<void>;
  loadTeamChallenges: () => Promise<void>;

  // Chat Actions
  createChatRoom: (
    name: string,
    type: string,
    participants: string[]
  ) => Promise<void>;
  sendMessage: (
    roomId: string,
    content: string,
    type?: string
  ) => Promise<void>;
  loadChatRoom: (roomId: string) => Promise<void>;
  markRoomAsRead: (roomId: string) => Promise<void>;

  // Notification Actions
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;

  // Subscription Management
  initializeSubscriptions: () => void;
  cleanupSubscriptions: () => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  userProfile: null,
  friends: [],
  friendRequests: [],
  friendSuggestions: [],
  activities: [],
  notifications: [],
  unreadNotifications: 0,
  activeTeamChallenges: [],
  pastTeamChallenges: [],
  chatRooms: [],
  currentChatRoom: null,
  chatMessages: {},
  unreadMessageCounts: {},
  subscriptions: {},

  updateProfile: async (profile) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(profile)
      .eq("user_id", supabase.auth.user()?.id)
      .single();

    if (error) throw error;
    set({ userProfile: { ...get().userProfile, ...profile } as UserProfile });
  },

  sendFriendRequest: async (targetUserId) => {
    const { data, error } = await supabase.from("friendships").insert({
      follower_id: supabase.auth.user()?.id,
      following_id: targetUserId,
      status: "pending",
    });

    if (error) throw error;
    showMessage({
      message: "Friend request sent!",
      type: "success",
    });
  },

  acceptFriendRequest: async (friendshipId) => {
    const { data: friendship, error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId)
      .single();

    if (error) throw error;

    // Update local state and trigger avatar reaction
    const updatedFriends = [...get().friends];
    set({ friends: updatedFriends });
    updateAvatarMood("happy");
    playAchievementSound();
  },

  declineFriendRequest: async (friendshipId) => {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);

    if (error) throw error;
    const updatedRequests = get().friendRequests.filter(
      (req) => req.id !== friendshipId
    );
    set({ friendRequests: updatedRequests });
  },

  unfriend: async (friendId) => {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .or(
        `follower_id.eq.${supabase.auth.user()?.id},following_id.eq.${
          supabase.auth.user()?.id
        }`
      )
      .or(`follower_id.eq.${friendId},following_id.eq.${friendId}`);

    if (error) throw error;
    const updatedFriends = get().friends.filter(
      (friend) => friend.id !== friendId
    );
    set({ friends: updatedFriends });
  },

  loadFriendSuggestions: async () => {
    const { data, error } = await supabase.rpc("get_friend_suggestions", {
      user_id: supabase.auth.user()?.id,
    });

    if (error) throw error;
    set({ friendSuggestions: data });
  },

  createActivity: async (type, content, metadata = {}) => {
    const { data, error } = await supabase.from("activities").insert({
      user_id: supabase.auth.user()?.id,
      activity_type: type,
      content,
      ...metadata,
    });

    if (error) throw error;
    const activities = get().activities;
    set({ activities: [data, ...activities] });
  },

  loadActivities: async () => {
    const { data, error } = await supabase
      .from("activities")
      .select(
        `
        *,
        user:user_profiles(*),
        workout:workouts(*),
        challenge:team_challenges(*),
        achievement:achievements(*)
      `
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    set({ activities: data });
  },

  createTeamChallenge: async (challenge) => {
    const { data, error } = await supabase.from("team_challenges").insert({
      ...challenge,
      created_by: supabase.auth.user()?.id,
      status: "upcoming",
    });

    if (error) throw error;
    const challenges = get().activeTeamChallenges;
    set({ activeTeamChallenges: [data, ...challenges] });
  },

  joinTeamChallenge: async (challengeId) => {
    const { data, error } = await supabase
      .from("challenge_participants")
      .insert({
        challenge_id: challengeId,
        user_id: supabase.auth.user()?.id,
        current_progress: 0,
      });

    if (error) throw error;
    await get().loadTeamChallenges();
    updateAvatarMood("excited");
  },

  updateChallengeProgress: async (challengeId, progress) => {
    const { data, error } = await supabase
      .from("challenge_participants")
      .update({ current_progress: progress })
      .eq("challenge_id", challengeId)
      .eq("user_id", supabase.auth.user()?.id);

    if (error) throw error;
    await get().loadTeamChallenges();
  },

  loadTeamChallenges: async () => {
    const { data, error } = await supabase
      .from("team_challenges")
      .select(
        `
        *,
        participants:challenge_participants(
          *,
          user:user_profiles(*)
        ),
        chatRoom:chat_rooms(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    const active = data.filter(
      (c) => c.status === "active" || c.status === "upcoming"
    );
    const past = data.filter(
      (c) => c.status === "completed" || c.status === "cancelled"
    );
    set({ activeTeamChallenges: active, pastTeamChallenges: past });
  },

  createChatRoom: async (name, type, participants) => {
    const { data: room, error: roomError } = await supabase
      .from("chat_rooms")
      .insert({
        name,
        type,
        created_by: supabase.auth.user()?.id,
      })
      .single();

    if (roomError) throw roomError;

    const participantInserts = participants.map((userId) => ({
      room_id: room.id,
      user_id: userId,
    }));

    const { error: participantError } = await supabase
      .from("chat_participants")
      .insert(participantInserts);

    if (participantError) throw participantError;
    const rooms = get().chatRooms;
    set({ chatRooms: [...rooms, room] });
  },

  sendMessage: async (roomId, content, type = "text") => {
    const { data, error } = await supabase.from("chat_messages").insert({
      room_id: roomId,
      user_id: supabase.auth.user()?.id,
      content,
      type,
    });

    if (error) throw error;
    const messages = get().chatMessages[roomId] || [];
    set({
      chatMessages: {
        ...get().chatMessages,
        [roomId]: [...messages, { ...data, user: get().userProfile }],
      },
    });
  },

  loadChatRoom: async (roomId) => {
    const { data: messages, error: messageError } = await supabase
      .from("chat_messages")
      .select(
        `
        *,
        user:user_profiles(*)
      `
      )
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (messageError) throw messageError;

    set({
      currentChatRoom: get().chatRooms.find((r) => r.id === roomId) || null,
      chatMessages: { ...get().chatMessages, [roomId]: messages },
    });

    await get().markRoomAsRead(roomId);
  },

  markRoomAsRead: async (roomId) => {
    const { error } = await supabase
      .from("chat_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("room_id", roomId)
      .eq("user_id", supabase.auth.user()?.id);

    if (error) throw error;
    set({
      unreadMessageCounts: {
        ...get().unreadMessageCounts,
        [roomId]: 0,
      },
    });
  },

  markNotificationAsRead: async (notificationId) => {
    const notifications = get().notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    set({
      notifications,
      unreadNotifications: get().unreadNotifications - 1,
    });
  },

  markAllNotificationsAsRead: async () => {
    const notifications = get().notifications.map((n) => ({
      ...n,
      read: true,
    }));
    set({ notifications, unreadNotifications: 0 });
  },

  initializeSubscriptions: () => {
    const userId = supabase.auth.user()?.id;
    if (!userId) return;

    // Activities subscription
    const activitiesSub = supabase
      .channel("activities")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activities",
          filter: `user_id=neq.${userId}`,
        },
        async (payload) => {
          const { data: activity } = await supabase
            .from("activities")
            .select(
              `
            *,
            user:user_profiles(*),
            workout:workouts(*),
            challenge:team_challenges(*),
            achievement:achievements(*)
          `
            )
            .eq("id", payload.new.id)
            .single();

          const activities = get().activities;
          set({ activities: [activity, ...activities] });
        }
      )
      .subscribe();

    // Notifications subscription
    const notificationsSub = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const notifications = get().notifications;
            set({
              notifications: [payload.new, ...notifications],
              unreadNotifications: get().unreadNotifications + 1,
            });
            showMessage({
              message: payload.new.content,
              type: "info",
            });
          }
        }
      )
      .subscribe();

    // Challenge updates subscription
    const challengesSub = supabase
      .channel("challenges")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "challenge_participants",
        },
        async () => {
          await get().loadTeamChallenges();
        }
      )
      .subscribe();

    // Chat messages subscription
    const chatSub = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        async (payload) => {
          if (payload.new.user_id === userId) return;

          const { data: message } = await supabase
            .from("chat_messages")
            .select(
              `
            *,
            user:user_profiles(*)
          `
            )
            .eq("id", payload.new.id)
            .single();

          const roomId = payload.new.room_id;
          const messages = get().chatMessages[roomId] || [];
          set({
            chatMessages: {
              ...get().chatMessages,
              [roomId]: [...messages, message],
            },
            unreadMessageCounts: {
              ...get().unreadMessageCounts,
              [roomId]: (get().unreadMessageCounts[roomId] || 0) + 1,
            },
          });

          if (get().currentChatRoom?.id !== roomId) {
            showMessage({
              message: `New message from ${message.user.display_name}`,
              type: "info",
            });
          }
        }
      )
      .subscribe();

    set({
      subscriptions: {
        activities: activitiesSub,
        notifications: notificationsSub,
        challenges: challengesSub,
        chat: chatSub,
      },
    });
  },

  cleanupSubscriptions: () => {
    const subs = get().subscriptions;
    Object.values(subs).forEach((sub) => sub?.unsubscribe());
    set({ subscriptions: {} });
  },
}));

// Initialize subscriptions when the store is first used
useSocialStore.getState().initializeSubscriptions();
