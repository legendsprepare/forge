import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import {
  GamificationState,
  XPSource,
  Achievement,
  LeagueTier,
  XP_REWARDS,
  STREAK_THRESHOLDS,
  LEVEL_THRESHOLDS,
  LEAGUE_SETTINGS,
} from '../types/gamification';
import { differenceInDays, isSameDay, startOfWeek } from 'date-fns';
import { useAvatarState } from '../hooks/useAvatarState';

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const calculateRequiredXP = (level: number): number => {
  return Math.pow(level - 1, 2) * 100;
};

interface GamificationStore extends GamificationState {
  // XP and Leveling
  addXP: (sources: XPSource[]) => Promise<void>;
  checkLevelUp: () => Promise<void>;

  // Streaks
  validateStreak: () => Promise<void>;
  useStreakShield: () => Promise<void>;

  // Achievements
  checkAchievements: () => Promise<void>;
  dismissAchievementModal: () => void;

  // League
  joinLeague: (tier: LeagueTier) => Promise<void>;
  updateLeagueStandings: () => Promise<void>;
  subscribeToLeague: () => Promise<void>;
  unsubscribeFromLeague: () => void;

  // Data Management
  fetchUserStats: () => Promise<void>;
  syncGameState: () => Promise<void>;
}

const useGamificationStore = create<GamificationStore>((set, get) => ({
  stats: null,
  achievements: [],
  userAchievements: [],
  streak: {
    count: 0,
    lastWorkoutDate: '',
    shieldCount: 3,
    multiplier: 1,
  },
  league: {
    currentCohort: null,
    members: [],
    userRank: 0,
    isPromotionZone: false,
    isDemotionZone: false,
  },
  isLoading: false,
  showLevelUpModal: false,
  showAchievementModal: false,
  latestAchievement: null,

  addXP: async (sources: XPSource[]) => {
    const { stats } = get();
    if (!stats) return;

    const totalXP = sources.reduce((sum, source) => sum + source.amount * source.multiplier, 0);

    const newXP = stats.current_xp + totalXP;
    const currentLevel = calculateLevel(stats.current_xp);
    const newLevel = calculateLevel(newXP);

    await supabase.from('user_stats').update({ current_xp: newXP }).eq('id', stats.id);

    set({ stats: { ...stats, current_xp: newXP } });

    if (newLevel > currentLevel) {
      set({ showLevelUpModal: true });
      await get().checkLevelUp();
    }
  },

  checkLevelUp: async () => {
    const { stats } = get();
    if (!stats) return;

    const newLevel = calculateLevel(stats.current_xp);
    if (newLevel <= stats.level) return;

    // Update level and check for evolution
    const { evolveAvatar } = useAvatarState.getState();
    if (
      (newLevel >= LEVEL_THRESHOLDS.EVOLUTION_1 && stats.level < LEVEL_THRESHOLDS.EVOLUTION_1) ||
      (newLevel >= LEVEL_THRESHOLDS.EVOLUTION_2 && stats.level < LEVEL_THRESHOLDS.EVOLUTION_2) ||
      (newLevel >= LEVEL_THRESHOLDS.EVOLUTION_3 && stats.level < LEVEL_THRESHOLDS.EVOLUTION_3)
    ) {
      await evolveAvatar();
    }

    // Add streak shield every 5 levels
    const shieldReward = Math.floor(newLevel / 5) - Math.floor(stats.level / 5);
    if (shieldReward > 0) {
      const newShieldCount = stats.shield_count + shieldReward;
      await supabase
        .from('user_stats')
        .update({
          level: newLevel,
          shield_count: newShieldCount,
        })
        .eq('id', stats.id);

      set({
        stats: { ...stats, level: newLevel, shield_count: newShieldCount },
      });
    } else {
      await supabase.from('user_stats').update({ level: newLevel }).eq('id', stats.id);

      set({ stats: { ...stats, level: newLevel } });
    }
  },

  validateStreak: async () => {
    const { stats, streak } = get();
    if (!stats) return;

    const today = new Date();
    const lastWorkout = new Date(streak.lastWorkoutDate);
    const daysSinceLastWorkout = differenceInDays(today, lastWorkout);

    if (daysSinceLastWorkout === 1 || isSameDay(today, lastWorkout)) {
      // Streak continues
      const newCount = streak.count + 1;
      const newMultiplier =
        newCount >= STREAK_THRESHOLDS.FLAME_4
          ? 2.0
          : newCount >= STREAK_THRESHOLDS.FLAME_3
            ? 1.75
            : newCount >= STREAK_THRESHOLDS.FLAME_2
              ? 1.5
              : newCount >= STREAK_THRESHOLDS.FLAME_1
                ? 1.25
                : 1.0;

      await supabase
        .from('user_stats')
        .update({
          streak_count: newCount,
          last_workout_date: today.toISOString(),
        })
        .eq('id', stats.id);

      set({
        streak: {
          ...streak,
          count: newCount,
          lastWorkoutDate: today.toISOString(),
          multiplier: newMultiplier,
        },
      });

      // Check for streak milestones
      if (newCount % 7 === 0) {
        await get().addXP([
          {
            amount: XP_REWARDS.STREAK_MILESTONE,
            multiplier: 1,
            description: `${newCount} Day Streak Bonus!`,
          },
        ]);
      }
    } else if (daysSinceLastWorkout > 1) {
      // Streak broken - check if shield should be used
      if (streak.shieldCount > 0) {
        await get().useStreakShield();
      } else {
        await supabase
          .from('user_stats')
          .update({
            streak_count: 0,
            last_workout_date: today.toISOString(),
          })
          .eq('id', stats.id);

        set({
          streak: {
            ...streak,
            count: 0,
            lastWorkoutDate: today.toISOString(),
            multiplier: 1,
          },
        });
      }
    }
  },

  useStreakShield: async () => {
    const { stats, streak } = get();
    if (!stats || streak.shieldCount === 0) return;

    const newShieldCount = streak.shieldCount - 1;
    await supabase
      .from('user_stats')
      .update({
        shield_count: newShieldCount,
        last_workout_date: new Date().toISOString(),
      })
      .eq('id', stats.id);

    set({
      streak: {
        ...streak,
        shieldCount: newShieldCount,
        lastWorkoutDate: new Date().toISOString(),
      },
    });
  },

  checkAchievements: async () => {
    const { stats, achievements, userAchievements } = get();
    if (!stats) return;

    const unlockedAchievements = new Set(userAchievements.map(ua => ua.achievement_id));

    for (const achievement of achievements) {
      if (unlockedAchievements.has(achievement.id)) continue;

      const requirements = achievement.requirements as any;
      let isUnlocked = false;

      switch (achievement.category) {
        case 'consistency':
          isUnlocked = stats.streak_count >= requirements.streak_days;
          break;
        case 'strength':
          isUnlocked = stats.total_workouts >= requirements.workout_count;
          break;
        case 'milestone':
          isUnlocked = stats.level >= requirements.level;
          break;
        // Add more achievement checks here
      }

      if (isUnlocked) {
        const newAchievement = {
          id: crypto.randomUUID(),
          user_id: stats.user_id,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString(),
          progress: 100,
        };

        await supabase.from('user_achievements').insert(newAchievement);

        set({
          userAchievements: [...userAchievements, newAchievement],
          showAchievementModal: true,
          latestAchievement: achievement,
        });

        await get().addXP([
          {
            amount: achievement.xp_reward,
            multiplier: 1,
            description: `Achievement: ${achievement.name}`,
          },
        ]);
      }
    }
  },

  dismissAchievementModal: () => {
    set({ showAchievementModal: false, latestAchievement: null });
  },

  joinLeague: async (tier: LeagueTier) => {
    const { stats } = get();
    if (!stats) return;

    const weekStart = startOfWeek(new Date());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + LEAGUE_SETTINGS.SEASON_LENGTH_DAYS);

    // Find or create a cohort
    const { data: cohort } = await supabase
      .from('league_cohorts')
      .select('*')
      .eq('tier', tier)
      .gte('end_date', new Date().toISOString())
      .single();

    let cohortId: string;

    if (cohort) {
      cohortId = cohort.id;
    } else {
      const { data: newCohort } = await supabase
        .from('league_cohorts')
        .insert({
          tier,
          start_date: weekStart.toISOString(),
          end_date: weekEnd.toISOString(),
          max_members: LEAGUE_SETTINGS.COHORT_SIZE,
        })
        .select()
        .single();

      if (!newCohort) throw new Error('Failed to create league cohort');
      cohortId = newCohort.id;
    }

    // Join the cohort
    await supabase.from('league_members').insert({
      cohort_id: cohortId,
      user_id: stats.user_id,
      points: 0,
      position: 0,
      joined_at: new Date().toISOString(),
    });

    await get().updateLeagueStandings();
  },

  updateLeagueStandings: async () => {
    const { stats, league } = get();
    if (!stats || !league.currentCohort) return;

    const { data: members } = await supabase
      .from('league_members')
      .select('*')
      .eq('cohort_id', league.currentCohort.id)
      .order('points', { ascending: false });

    if (!members) return;

    // Update positions
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (member.position !== i + 1) {
        await supabase
          .from('league_members')
          .update({ position: i + 1 })
          .eq('id', member.id);

        if (member.user_id === stats.user_id) {
          set({
            league: {
              ...league,
              members,
              userRank: i + 1,
              isPromotionZone: i + 1 <= LEAGUE_SETTINGS.PROMOTION_THRESHOLD,
              isDemotionZone: i + 1 >= LEAGUE_SETTINGS.DEMOTION_THRESHOLD,
            },
          });
        }
      }
    }
  },

  subscribeToLeague: async () => {
    const { stats } = get();
    if (!stats) return;

    const subscription = supabase
      .channel('league_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'league_members',
        },
        () => {
          get().updateLeagueStandings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  unsubscribeFromLeague: () => {
    supabase.channel('league_updates').unsubscribe();
  },

  fetchUserStats: async () => {
    set({ isLoading: true });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: achievements } = await supabase.from('achievements').select('*');

      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (stats && achievements) {
        set({
          stats,
          achievements: achievements,
          userAchievements: userAchievements || [],
          streak: {
            count: stats.streak_count,
            lastWorkoutDate: stats.last_workout_date,
            shieldCount: stats.shield_count,
            multiplier: 1, // Will be calculated in validateStreak
          },
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  syncGameState: async () => {
    await Promise.all([
      get().fetchUserStats(),
      get().updateLeagueStandings(),
      get().checkAchievements(),
    ]);
  },
}));

export default useGamificationStore;
